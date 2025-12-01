@echo off
REM Windows click-to-run launcher for Supabase keepalive
setlocal enableextensions
cd /d "%~dp0"

REM Try python.exe first; if not found, try py launcher
where python >nul 2>nul
if %errorlevel%==0 (
  python "%~dp0supabase_keepalive.py"
) else (
  where py >nul 2>nul
  if %errorlevel%==0 (
    py "%~dp0supabase_keepalive.py"
  ) else (
    echo Python is not installed or not on PATH. Please install Python 3.x from https://www.python.org/downloads/
    pause
    exit /b 1
  )
)

echo.
echo Done.
pause
endlocal
