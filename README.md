<h1 align="center">🍗Pathfinding Civilization🥩</h1>
<h2 align="center">Beef (A*) or Chicken (Dijkstra)?</h2>

## I. Project Overview

**Pathfinding Civilization** is a web-based Pathfinding algorithm visualizer. That utilizes **A\*** and **Dijkstra** as the choice of algorithms to be visualized. The algorithm visualized will be displayed in a grid that can be modified by the user to include non-travelable walls and be able to compare these two algorithms by path and search method, displayed by animation. The main theme of this project is helping Steve, the Minecraft character, be able get to the chicken (A\*), or beef (Dijkstra), and feed his hungry self. Will he go for the chicken, where the path is efficient, and be able to arrive at it much faster? Or will he go for the beef, where it’s the safest, and most thorough approach? The user decides that option.

## 🏗️ System Architecture

**Key Components**

- **Frontend:**
  - `SCSS`
    - Short for Sassy Cascading Style Sheets, is a preprocessor scripting language that extends CSS (Cascading Style Sheets) with additional features.
  - `React-Howler`
    - This is a simple, accessible audio player built using Reactjs and Howlerjs.
  - `React-widgets`
    - A high quality suite of React inputs.
- **Backend:**

  - `Axios`

    - Promise-based HTTP client used to make HTTP requests. In this code, it is used to send a POST request to the Google reCAPTCHA API to verify the CAPTCHA token. The request includes the secret key and the response token, and it checks the verification status based on the response.

  - `Express`

    - A web framework for Node.js that simplifies the creation of web servers and handling of routes. In this code, express is used to create an API server. It listens for POST requests at the /verify-captcha endpoint, processes incoming JSON requests, and returns the appropriate responses based on the CAPTCHA verification result.

  - `Cors`
    - A middleware used to enable Cross-Origin Resource Sharing (CORS), allowing requests from different origins (e.g., a front-end application hosted on a different server). In this code, cors() is used to enable CORS support, ensuring that the server can accept requests from client applications running on different domains.

## 🤓 Applied Computer Science Concept

- **Graph Theory**
  - Being a branch of mathematics and computer science that deals with nodes (vertices) and edges (connections between nodes). The principle of Graph Theory is directly applied on Pathfinding.
- **Time Complexity**
  - Showing the time complexity gives the user a tangible visualization of the difference in computation time between the 2 algorithms.

## 😵‍💫 Algorithms Used

- **A\***
  - An informed search algorithm that finds the shortest path by combining the actual cost from the start to a node and a heuristic estimate of the cost to the goal. It prioritizes nodes likely to lead to the goal quickly and efficiently.
- **Dijkstra**
  - An uninformed algorithm that finds the shortest path from a starting node to all other nodes by exploring all possible paths in order of increasing cost, ensuring the shortest path is found.

## 🔐 Security Mechanisms

- The implementation of a human verification system API known as `reCAPTCHA` to differentiate between real users and automated users, such as bots.
- By limiting the options for the user to only placing blocks and button presses, this significantly reduces the risk close 0% of having invalid inputs that could potentially be used as an exploit on the web application.

## 🤔 Development Process and Design Decisions

Concept and Theme

The web app is designed around a Minecraft theme, leveraging its iconic blocky aesthetic and engaging elements. This involves mimicking the appearance of Minecraft’s environment with a grid-based map, block types, and assets like obsidian, raw chicken, raw beef and oak signs. The goal is to provide users with an intuitive and visually engaging way to explore pathfinding algorithms while remaining true to the theme.

- Development Phases

  - Planning and Prototyping:
    - Wireframe the layout and determine core functionality.
    - Create a basic grid layout using React.
  - UI/UX Design:
    - Integrate Minecraft textures to match the target aesthetic.
  - Algorithm Implementation:

    - Develop and test pathfinding algorithms in the backend using reusable functions for each algorithm.
    - Abstract common code into utilities to avoid redundancy and follow the DRY (Don't Repeat Yourself) principle.

  - Integration:

    - Combine frontend interactivity with backend processing and implement the relevant APIs.

  - Launch and Iteration:
    - Deploy the app and gather user feedback.
    - Iterate based on feedback, adding features like advanced algorithms or enhanced visual effects.

- Challenges and Decisions

  - Maintaining Performance:

    - Balancing high-quality visuals with efficient algorithm execution.
    - Refactoring code to reduce duplication and ensure efficient updates across related components.

  - Minecraft Aesthetic:
    - Ensuring Minecraft textures do not overwhelm the usability of the app.
    - Using shared styling utilities for consistent aesthetic elements.

## ✅ Correctness and Efficiency

**Ensuring the Correctness:**

- Inputs are strictly regulated, only providing the user what is necessary in order to properly interact with the web application.

**Ensuring the Efficiency:**

- By adhering to the DRY principle and integrating Minecraft’s immersive aesthetic with engaging pathfinding visualizations, the app becomes both a fun and educational tool.

## 🏃🏿‍♂️‍➡️ How to Run the Project

- Prerequisites:
  - [Node.js](https://nodejs.org/en)

1. Clone the repository
   ```bash
   git clone https://github.com/Kryptiku/Pathfinding_Civilization.git
   ```
2. Open project in IDE of choice and open the `git bash` terminal and run the following commands:

   ```bash
   cd my-app
   ```

   ```bash
   npm i
   ```

   ```bash
   node server.js
   ```

3. On a new `git bash` terminal run the following commands:

   ```bash
   cd my-app
   ```

   ```bash
   npm start
   ```

4. Now that the app is running you can start by placing blocks on the grid using your mouse or select `Random Walls` option to generate a random set of walls.

5. Select your algorithm on the top-left drop-down.

6. Hit `Visualize` and watch the magic.

## 🟢 Supabase keepalive (optional)

If you use Supabase and want to generate small periodic traffic to keep the project from being marked inactive, there’s a helper in `scripts/`.

Setup:

- Copy `scripts/.env.example` to `scripts/.env` and fill in at least `SUPABASE_URL` and (recommended) `SUPABASE_ANON_KEY`.
- Optionally set `SUPABASE_TABLE` to a lightweight public table; otherwise it will still ping health and REST root.
- Adjust `KEEPALIVE_REQUESTS` and `KEEPALIVE_INTERVAL_SECONDS` if desired.

Run on Windows (double‑click):

- Double‑click `scripts/run_keepalive.bat`.
  - The script auto‑installs the `requests` package if missing.

Run from terminal (optional):

```powershell
cd scripts
python supabase_keepalive.py
```

Notes:

- Sends safe GET requests only; it won’t modify your data.
- If `SUPABASE_TABLE` is provided, it performs a `select` limited to 1 row with `count=exact` to keep it light.

## 🧑‍💻 Contributors

**Front End:** [Mirabel, Kevin Hans Aurick S.](https://github.com/kebinmirabel)

**Back End:** [Capistrano, Vency Gyro R.](https://github.com/KazuMoment)

**Project Manager/Fullstack:** [Antony, Aldrich Ryan V.](https://github.com/Kryptiku)

## 💖 Acknowledgment

**Instructor:** Dominic Miko Valdez
