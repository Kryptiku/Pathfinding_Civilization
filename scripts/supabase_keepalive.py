#!/usr/bin/env python3
"""
Supabase Keepalive Script
Purpose: Generate light, periodic traffic to a Supabase project to indicate activity.

Configuration (via environment variables or a .env file placed next to this script):
  SUPABASE_URL                Required. Example: https://your-project.supabase.co
  SUPABASE_ANON_KEY           Recommended. Used for REST requests (Bearer token).
  SUPABASE_TABLE              Optional. If set, performs a cheap SELECT on this table.
  KEEPALIVE_REQUESTS          Optional. How many requests to send (default: 10)
  KEEPALIVE_INTERVAL_SECONDS  Optional. Seconds between requests (default: 30)

Windows one-click: Double-click run_keepalive.bat in this folder.

Notes:
- This script intentionally sends tiny, safe requests. If SUPABASE_TABLE isn't set,
  it will still ping the Auth health endpoint and a REST root path to generate traffic.
- The script will try to install the 'requests' package automatically if missing.
"""

import os
import sys
import time
import subprocess
from typing import Optional


def ensure_requests_installed():
    try:
        import requests  # noqa: F401
        return
    except ImportError:
        print("[info] Python 'requests' not found. Attempting to install...")
        try:
            # Use the current Python executable to install
            subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "requests"]) 
        except Exception as e:
            print(f"[error] Failed to install requests: {e}")
            print("Install it manually: pip install requests")
            sys.exit(1)


def load_dotenv(path: str):
    if not os.path.exists(path):
        return
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                os.environ.setdefault(key, value)
    except Exception as e:
        print(f"[warn] Could not parse .env: {e}")


def make_headers(api_key: Optional[str]) -> dict:
    headers = {
        "Accept": "application/json",
    }
    if api_key:
        headers["apikey"] = api_key
        headers["Authorization"] = f"Bearer {api_key}"
        headers["Content-Type"] = "application/json"
    return headers


def hit_auth_health(base_url: str, api_key: Optional[str]) -> int:
    import requests
    url = base_url.rstrip("/") + "/auth/v1/health"
    try:
        r = requests.get(url, headers=make_headers(api_key), timeout=15)
        print(f"[auth] GET {url} -> {r.status_code}")
        return r.status_code
    except Exception as e:
        print(f"[auth] Error: {e}")
        return -1


def hit_rest_table(base_url: str, api_key: Optional[str], table: str) -> int:
    import requests
    # Cheap count request; limit 1 to keep it light
    url = base_url.rstrip("/") + f"/rest/v1/{table}?select=*&limit=1"
    headers = make_headers(api_key)
    headers["Prefer"] = "count=exact"
    headers["Range"] = "0-0"
    try:
        r = requests.get(url, headers=headers, timeout=15)
        # 200/206 expected; 401/404 still count as traffic if misconfigured
        print(f"[rest] GET {url} -> {r.status_code}")
        return r.status_code
    except Exception as e:
        print(f"[rest] Error: {e}")
        return -1


def hit_rest_root(base_url: str, api_key: Optional[str]) -> int:
    import requests
    url = base_url.rstrip("/") + "/rest/v1/"
    try:
        r = requests.get(url, headers=make_headers(api_key), timeout=15)
        print(f"[rest] GET {url} -> {r.status_code}")
        return r.status_code
    except Exception as e:
        print(f"[rest] Error: {e}")
        return -1


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    load_dotenv(os.path.join(script_dir, ".env"))

    supabase_url = os.getenv("SUPABASE_URL")
    api_key = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    table = os.getenv("SUPABASE_TABLE")
    try:
        total = int(os.getenv("KEEPALIVE_REQUESTS", "10"))
    except ValueError:
        total = 10
    try:
        interval = int(os.getenv("KEEPALIVE_INTERVAL_SECONDS", "30"))
    except ValueError:
        interval = 30

    if not supabase_url:
        print("[error] SUPABASE_URL is required. Set it in scripts/.env or your environment.")
        sys.exit(1)

    print("=== Supabase Keepalive ===")
    print(f"URL: {supabase_url}")
    print(f"Table: {table or '(none)'}")
    print(f"Requests: {total}, Interval: {interval}s")
    print("-------------------------")

    # Ensure requests is available before hitting endpoints
    ensure_requests_installed()

    for i in range(1, total + 1):
        print(f"\n[loop] {i}/{total}")
        # Always hit auth health
        hit_auth_health(supabase_url, api_key)
        # Hit table if provided, else rest root
        if table:
            hit_rest_table(supabase_url, api_key, table)
        else:
            hit_rest_root(supabase_url, api_key)

        if i < total:
            time.sleep(interval)

    print("\n[done] Keepalive completed.")


if __name__ == "__main__":
    main()
