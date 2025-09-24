import React from 'react';
import './App.css';
import PathfindingCivilization from './PathfindingCivilization/PathfindingVisualizer';

function App() {
  return (
    <div id="container">
      <div id="header">
        <h1 id="header">Pathfinding Civilization</h1>
      </div>
      <div className="App">
        <PathfindingCivilization />
      </div>
    </div>
  );
}

export default App;
