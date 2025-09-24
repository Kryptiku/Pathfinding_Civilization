import React, { Component } from "react";
import Howler from "react-howler";
import { Howl } from "howler";
import DropdownList from "react-widgets/DropdownList";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { aStar } from "../algorithms/aStar";
import "./PathfindingVisualizer.css";
import "react-widgets/styles.css";
import "./DropdownList.scss";
import DijkstraImage from "../assets/ChickenDijkstra.png";
import AStarImage from "../assets/BeefAStar.png";
import BgMusic from "../assets/sounds/Sweden.mp3";
import MusicOnIcon from "../assets/musicon.png";
import MusicOffIcon from "../assets/musicoff.png";
import PlaceWallSound1 from "../assets/sounds/Stone_dig1.ogg";
import PlaceWallSound2 from "../assets/sounds/Stone_dig2.ogg";
import PlaceWallSound3 from "../assets/sounds/Stone_dig2shifted.ogg";
import PlaceWallSound4 from "../assets/sounds/Stone_dig3.ogg";
import PlaceWallSound5 from "../assets/sounds/Stone_dig4.ogg";
import BreakSound from "../assets/sounds/Random_break.ogg";
import DenySound from "../assets/sounds/Villager_deny1.oga";
import RunningSound from "../assets/sounds/Beacon_ambient.ogg";
import StartSound1 from "../assets/sounds/Beacon_power1.ogg";
import StartSound2 from "../assets/sounds/Beacon_power2.ogg";
import ClickSound from "../assets/sounds/Click.ogg";
import CloseDropdownSound from "../assets/sounds/Chest_close2.ogg";
import ShortestFoundSound1 from "../assets/sounds/Successful_hit.oga";
import FinishSound from "../assets/sounds/XP_Old.oga";

// when adding algos, just search 'algos' for requirements

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 50;
const algorithms = ["Dijkstra", "A*"]; // add options if adding algos

// Helper function to calculate start and finish positions based on grid size
const getStartNodePosition = (rows, cols) => ({
  row: Math.floor(rows / 2),
  col: Math.floor(cols * 0.3),
});

const getFinishNodePosition = (rows, cols) => ({
  row: Math.floor(rows / 2),
  col: Math.floor(cols * 0.7),
});

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
      rowsInput: DEFAULT_ROWS.toString(),
      colsInput: DEFAULT_COLS.toString(),
      mouseIsPressed: false,
      buttonDisabled: false,
      selectedAlgorithm: null,
      isDropdownOpen: false,
      algorithmTimer: null,
      animationTimer: null,
      isMusicPlaying: true, // dont forget to turn on, was just annoying replaying over and over
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.rows, this.state.cols);
    this.setState({ grid });
  }

  clearGrid(alsoWall, selectedAlgorithm) {
    const { grid } = this.state;

    const newGrid = grid.map((row) =>
      row.map((node) => {
        const baseNode = {
          ...node,
          isVisited: false,
          isWall: false,
          distance: Infinity,
          previousNode: null,
          heuristic: 0,
          fCost: Infinity,
        };

        if (!alsoWall && node.isWall) {
          baseNode.isWall = true;
        }

        return node.isStart || node.isFinish ? baseNode : baseNode;
      })
    );

    this.setState({ grid: newGrid, selectedAlgorithm }); // Ensure selectedAlgorithm persists

    newGrid.forEach((row, rowIndex) => {
      row.forEach((node, colIndex) => {
        const nodeElement = document.getElementById(
          `node-${rowIndex}-${colIndex}`
        );
        if (nodeElement) {
          // Logic to determine the extra class names for each node
          const extraClassName = node.isFinish
            ? `node-finish ${
                selectedAlgorithm === "Dijkstra"
                  ? "node-dijkstra-finish"
                  : selectedAlgorithm === "A*"
                  ? "node-astar-finish"
                  : ""
              }`
            : node.isStart
            ? "node-start"
            : node.isWall
            ? "node-wall"
            : "";

          // Apply the class names based on node type and selected algorithm
          if (alsoWall) {
            nodeElement.className = `node ${
              node.isStart
                ? "node-start"
                : node.isFinish
                ? `node-finish ${
                    selectedAlgorithm === "Dijkstra"
                      ? "node-dijkstra-finish"
                      : selectedAlgorithm === "A*"
                      ? "node-astar-finish"
                      : ""
                  }`
                : ""
            }`.trim();
          } else {
            nodeElement.className = `node ${extraClassName}`.trim();
          }
        }
      });
    });
  }

  playClearSound = () => {
    const clearSound = new Howl({
      src: [BreakSound],
      volume: 0.3,
    });
    clearSound.play();
  };

  playWallSound = () => {
    const wallSound1 = new Howl({ src: [PlaceWallSound1], volume: 0.2 });
    const wallSound2 = new Howl({ src: [PlaceWallSound2], volume: 0.2 });
    const wallSound3 = new Howl({ src: [PlaceWallSound3], volume: 0.2 });
    const wallSound4 = new Howl({ src: [PlaceWallSound4], volume: 0.2 });
    const wallSound5 = new Howl({ src: [PlaceWallSound5], volume: 0.2 });

    let num = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

    switch (
      num // random wall sounds
    ) {
      case 1:
        wallSound1.play();
        break;
      case 2:
        wallSound2.play();
        break;
      case 3:
        wallSound3.play();
        break;
      case 4:
        wallSound4.play();
        break;
      case 5:
        wallSound5.play();
        break;
      default:
        wallSound1.play();
        break;
    }
  };

  playDenySound = () => {
    const denysound = new Howl({ src: [DenySound], volume: 0.5 });
    denysound.play();
  };

  playStartSound = () => {
    const startsound1 = new Howl({ src: [StartSound1], volume: 0.3 });
    const startsound2 = new Howl({ src: [StartSound2], volume: 0.3 });

    let num = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

    switch (num) {
      case 1:
        startsound1.play();
        break;
      case 2:
        startsound2.play();
        break;
      default:
        startsound1.play();
        break;
    }
  };

  playClickSound = () => {
    const clicksound = new Howl({ src: [ClickSound], volume: 0.3 });
    clicksound.play();
  };

  playCloseDropdownSound = () => {
    const closedropdownsound = new Howl({
      src: [CloseDropdownSound],
      volume: 0.2,
    });
    closedropdownsound.play();
  };

  playShortestFoundSound1 = () => {
    const shortestfoundsound = new Howl({
      src: [ShortestFoundSound1],
      volume: 0.08,
    });
    shortestfoundsound.play();
  };

  playFinishSound = () => {
    const finishsound = new Howl({ src: [FinishSound], volume: 0.1 });
    finishsound.play();
  };

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
    this.playWallSound();
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
    this.playWallSound();
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    // Find the start node and add 'node-active-steve'
    const startNode = document.querySelector(".node-start");
    if (startNode) {
      startNode.classList.add("node-active-steve");
    }

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
      this.setState({ isAlgoRunning: false });
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        this.playShortestFoundSound1();

        // Get the current node
        const node = nodesInShortestPathOrder[i];
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );

        // Add 'node-active-steve' class to show the character
        nodeElement.classList.add("node-active-steve");

        // If this is not the last node, remove 'node-active-steve' after 0.1 seconds
        if (i < nodesInShortestPathOrder.length - 1) {
          setTimeout(() => {
            nodeElement.classList.remove("node-active-steve");

            // Add 'node-shortest-path' class to mark the path
            nodeElement.className = "node node-shortest-path";
          }, 100); // 0.1 seconds
        } else {
          // Keep 'node-active-steve' on the last node
          nodeElement.classList.add("node-shortest-path");
        }
      }, 75 * i); // Delay each step by 75ms
    }
  }

  visualize(algorithm) {
    const { selectedAlgorithm, grid, rows, cols } = this.state;

    if (!selectedAlgorithm) {
      const descriptionElement = document.getElementById("algo-description");
      if (descriptionElement) {
        descriptionElement.classList.add("shake");
        setTimeout(() => {
          descriptionElement.classList.remove("shake");
        }, 300);
      }
      this.playDenySound();
      return;
    }

    // start timer for algo
    const algorithmStartTime = Date.now();

    this.setState({
      buttonDisabled: true,
      algorithmTimer: null,
      animationTimer: null,
    });
    this.clearGrid(false, this.state.selectedAlgorithm);
    this.playStartSound();
    this.playClickSound();

    const startPos = getStartNodePosition(rows, cols);
    const finishPos = getFinishNodePosition(rows, cols);
    const startNode = grid[startPos.row][startPos.col];
    const finishNode = grid[finishPos.row][finishPos.col];
    let visitedNodesInOrder;

    switch (algorithm) {
      case "A*":
        visitedNodesInOrder = aStar(grid, startNode, finishNode);
        break;
      case "Dijkstra":
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      default:
        return;
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    // calculate and store timer for algorithm
    const algorithmEndTime = Date.now();
    const algorithmDuration = algorithmEndTime - algorithmStartTime;
    this.setState({ algorithmTimer: algorithmDuration });

    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);

    // start timer for animation
    const animationStartTime = Date.now();

    setTimeout(() => {
      this.playFinishSound();
      this.setState({ buttonDisabled: false });

      // calculate and store timer for animation
      const animationEndTime = Date.now();
      const animationDuration = animationEndTime - animationStartTime;
      this.setState({ animationTimer: animationDuration });
    }, 10 * visitedNodesInOrder.length + 75 * nodesInShortestPathOrder.length);
  }

  getAlgorithmDescription = (algorithm) => {
    // add the brief descriptions here for new algos
    switch (algorithm) {
      case "A*":
        return (
          <div>
            <h1 class="sign">A* Algorithm</h1>
            <p class="sign">
              A* uses heuristics to find the shortest path efficiently.
            </p>
          </div>
        );
      case "Dijkstra":
        return (
          <div>
            <h1 class="sign">Dijkstra's Algorithm</h1>
            <p class="sign">
              Dijkstra's algorithm finds the shortest paths between nodes in a
              weighted graph.
            </p>
          </div>
        );
      default:
        return <h1 class="sign">Pick an Algorithm:</h1>;
    }
  };

  handleChange = (value) => {
    this.setState({ selectedAlgorithm: value, isDropdownOpen: false });
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };

  handleClickOutside = (event) => {
    const dropdownList = document.getElementById("dropdown-list");
    if (dropdownList && !dropdownList.contains(event.target)) {
      this.setState({ isDropdownOpen: false }); // close dropdownlist if clicking outside
    }
  };

  componentDidUpdate(_, prevState) {
    if (prevState.isDropdownOpen !== this.state.isDropdownOpen) {
      // detect outside click
      if (this.state.isDropdownOpen) {
        document.addEventListener("click", this.handleClickOutside);
        this.playClickSound();
      } else {
        document.removeEventListener("click", this.handleClickOutside);
        this.playCloseDropdownSound();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  toggleMusic = () => {
    this.setState((prevState) => ({
      isMusicPlaying: !prevState.isMusicPlaying,
    }));
  };

  generateRandomMaze = () => {
    const { grid } = this.state;
    const newGrid = grid.map((row) =>
      row.map((node) => {
        // Ensure the start and finish nodes are not walls
        if (node.isStart || node.isFinish) {
          return node;
        }
        // Randomly decide if this node should be a wall
        const isWall = Math.random() < 0.2; // 20% chance for each node to be a wall
        return {
          ...node,
          isWall: isWall,
        };
      })
    );

    this.setState({ grid: newGrid });
  };

  updateGridSize = (newRows, newCols) => {
    if (newRows < 5 || newRows > 50 || newCols < 10 || newCols > 100) {
      alert("Grid size must be between 5-50 rows and 10-100 columns");
      return false;
    }

    const newGrid = getInitialGrid(newRows, newCols);
    this.setState({
      grid: newGrid,
      rows: newRows,
      cols: newCols,
    });
    return true;
  };

  handleRowsChange = (event) => {
    // Just update the input value in state, don't validate yet
    const value = event.target.value;
    this.setState({ rowsInput: value });
  };

  handleColsChange = (event) => {
    // Just update the input value in state, don't validate yet
    const value = event.target.value;
    this.setState({ colsInput: value });
  };

  handleRowsBlur = (event) => {
    const value = event.target.value;
    const newRows = parseInt(value);

    if (isNaN(newRows) || !this.updateGridSize(newRows, this.state.cols)) {
      // Reset to current valid value if invalid
      this.setState({ rowsInput: this.state.rows.toString() });
    } else {
      this.setState({ rowsInput: newRows.toString() });
    }
  };

  handleColsBlur = (event) => {
    const value = event.target.value;
    const newCols = parseInt(value);

    if (isNaN(newCols) || !this.updateGridSize(this.state.rows, newCols)) {
      // Reset to current valid value if invalid
      this.setState({ colsInput: this.state.cols.toString() });
    } else {
      this.setState({ colsInput: newCols.toString() });
    }
  };

  // add here for more algos
  getExtendedAlgorithmDescription = (algorithm) => {
    switch (algorithm) {
      case "A*":
        return (
          <>
            <div class="info">
              <div class="content">
                <h1 class="algo-title">
                  A* Algorithm{" "}
                  <img
                    src={AStarImage}
                    alt="A* Algorithm Character"
                    class="algo-title"
                  ></img>
                </h1>
                <p class="info">
                  A* is a popular pathfinding algorithm widely used in games and
                  mapping applications due to its efficiency. It combines the
                  actual cost to reach a node (gScore) with an estimated cost to
                  the goal (heuristic) to prioritize exploration. The heuristic
                  is a smart guess, such as the straight-line distance or the
                  number of steps to the target, helping the algorithm focus on
                  the most promising paths. Using a priority queue to track
                  nodes and iteratively updating costs, A* explores nodes with
                  the lowest total estimated cost (fScore) until it finds the
                  shortest path or determines no path exists.
                </p>
              </div>
            </div>
            <div class="info">
              <div class="content">
                <h1 class="algo-title">How it works:</h1>
                <iframe
                  class="ytvid"
                  src="https://www.youtube.com/embed/71CEj4gKDnE?si=SnfHqElTbotlOaWw"
                  title="Youtube"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </>
        );
      case "Dijkstra":
        return (
          <>
            <div class="info">
              <div class="content">
                <h1 class="algo-title">
                  Dijkstra Algorithm{" "}
                  <img
                    src={DijkstraImage}
                    alt="Dijkstra Algorithm Character"
                    class="algo-title"
                  ></img>
                </h1>
                <p class="info">
                  Dijkstra’s algorithm, developed by Edsger W. Dijkstra in 1956,
                  is a widely-used method for finding the shortest path from a
                  single source vertex to other vertices in a graph with
                  non-negative edge weights. It works by maintaining two sets of
                  vertices: visited and unvisited. Starting from the source
                  vertex, it iteratively selects the unvisited vertex with the
                  smallest tentative distance, updates the distances of its
                  neighbors if shorter paths are found, and repeats this until
                  the target vertex is reached or all reachable vertices are
                  processed. In directed graphs, it follows edge directions,
                  while in undirected graphs, edges can be traversed in both
                  directions.
                </p>
              </div>
            </div>
            <div class="info">
              <div class="content">
                <h1 class="algo-title">How it works:</h1>
                <iframe
                  class="ytvid"
                  src="https://www.youtube.com/embed/EFg3u_E6eHU"
                  title="How Dijkstra Algorithm Works - Spanning Tree"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </>
        );
      default:
        return (
          <div class="default-info">
            <h1 class="algo-title">Please choose an algorithm first.</h1>
          </div>
        );
    }
  };

  render() {
    const {
      grid,
      mouseIsPressed,
      selectedAlgorithm,
      isDropdownOpen,
      isMusicPlaying,
      rows,
      cols,
    } = this.state;

    return (
      <>
        <Howler src={BgMusic} playing={isMusicPlaying} volume={0.3} loop />
        <Howler src={RunningSound} playing={this.state.buttonDisabled} loop />

        <div id="controls">
          <div id="dropdown-container">
            <DropdownList
              id="dropdown-list"
              data={algorithms}
              value={selectedAlgorithm || "Algorithms:"}
              onChange={this.handleChange}
              open={isDropdownOpen}
              onToggle={this.toggleDropdown}
              disabled={this.state.buttonDisabled}
            />
          </div>

          {/* visualize algorithm */}
          <button
            onClick={() => {
              this.visualize(selectedAlgorithm);
            }}
            style={{
              backgroundColor: this.state.buttonDisabled ? "red" : "#87A330",
              cursor: this.state.buttonDisabled ? "not-allowed" : "pointer",
            }}
            disabled={this.state.buttonDisabled}
          >
            Visualize {selectedAlgorithm}
          </button>
          {/* clear the grid including walls and path */}
          <button
            onClick={() => {
              this.playClearSound();
              this.playClickSound();
              this.clearGrid(true, this.state.selectedAlgorithm);
            }}
            style={{
              cursor: this.state.buttonDisabled ? "not-allowed" : "pointer",
            }}
            disabled={this.state.buttonDisabled}
          >
            Clear Grid
          </button>

          {/* clear the path but keep walls */}
          <button
            onClick={() => {
              this.playClearSound();
              this.playClickSound();
              this.clearGrid(false, this.state.selectedAlgorithm);
            }}
            style={{
              cursor: this.state.buttonDisabled ? "not-allowed" : "pointer",
            }}
            disabled={this.state.buttonDisabled}
          >
            Clear Path
          </button>
          <button
            onClick={() => {
              this.generateRandomMaze();
              this.playClickSound();
            }}
            style={{
              cursor: this.state.buttonDisabled ? "not-allowed" : "pointer",
            }}
            disabled={this.state.buttonDisabled}
          >
            Random Walls
          </button>
          {/* toggle music on/off */}
          <button
            onClick={() => {
              this.toggleMusic(!this.state.isMusicPlaying);
              this.playClickSound();
            }}
          >
            <img
              src={isMusicPlaying ? MusicOnIcon : MusicOffIcon}
              alt={isMusicPlaying ? "Music On" : "Music Off"}
              style={{ width: "24px", height: "24px" }}
            />
          </button>
        </div>

        {/* Grid size controls */}
        <div id="grid-size-controls">
          <div className="size-control">
            <label htmlFor="rows-input">Rows:</label>
            <input
              id="rows-input"
              type="number"
              min="5"
              max="50"
              value={this.state.rowsInput}
              onChange={this.handleRowsChange}
              onBlur={this.handleRowsBlur}
              disabled={this.state.buttonDisabled}
            />
          </div>
          <div className="size-control">
            <label htmlFor="cols-input">Columns:</label>
            <input
              id="cols-input"
              type="number"
              min="10"
              max="100"
              value={this.state.colsInput}
              onChange={this.handleColsChange}
              onBlur={this.handleColsBlur}
              disabled={this.state.buttonDisabled}
            />
          </div>
        </div>
        <div id="algo-description-container">
          <div id="algo-description">
            {this.getAlgorithmDescription(selectedAlgorithm)}
          </div>
        </div>
        <div id="timer-container">
          <div id="algorithm-timer">
            <strong>Algorithm Time: </strong>
            <p class="timer">
              {this.state.algorithmTimer
                ? `${this.state.algorithmTimer} ms`
                : "Not started"}
            </p>
          </div>
          <div id="animation-timer">
            <strong>Animation Time: </strong>
            <p class="timer">
              {this.state.animationTimer
                ? `${this.state.animationTimer / 1000} s`
                : "Not started"}
            </p>
          </div>
        </div>
        <div id="grid-container">
          <div
            className="grid"
            style={{
              width: `${cols * 25 + 40}px`,
              height: `${rows * 25 + 40}px`,
            }}
          >
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {
                      isStart,
                      isFinish,
                      row,
                      col,
                      isWall,
                      heuristic,
                      fCost,
                    } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        fCost={fCost}
                        heuristic={heuristic}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => {
                          if (!isStart && !isFinish) {
                            this.handleMouseDown(row, col);
                          }
                        }}
                        onMouseEnter={(row, col) => {
                          if (!isStart && !isFinish) {
                            this.handleMouseEnter(row, col);
                          }
                        }}
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                        selectedAlgorithm={this.state.selectedAlgorithm}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div id="info-container">
          <div id="info">
            {this.getExtendedAlgorithmDescription(selectedAlgorithm)}
          </div>
        </div>
      </>
    );
  }
}

const getInitialGrid = (rows, cols) => {
  const grid = [];
  const startPos = getStartNodePosition(rows, cols);
  const finishPos = getFinishNodePosition(rows, cols);

  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col, startPos, finishPos));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col, startPos, finishPos) => {
  return {
    row,
    col,
    isStart: row === startPos.row && col === startPos.col,
    isFinish: row === finishPos.row && col === finishPos.col,
    isWall: false,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    heuristic: 0,
    fCost: Infinity,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
