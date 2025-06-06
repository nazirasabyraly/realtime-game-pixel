import React, { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addPlayer, updatePlayerPosition, subscribeToPlayers, removePlayer } from '../services/firebase';
import '../styles/Game.css';

const Game = () => {
  const [playerId] = useState(() => uuidv4());
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState({});

  const handlePlayerAdded = useCallback((id, playerData) => {
    setPlayers(prev => ({
      ...prev,
      [id]: playerData
    }));
  }, []);

  const handlePlayerMoved = useCallback((id, playerData) => {
    setPlayers(prev => ({
      ...prev,
      [id]: playerData
    }));
  }, []);

  const handlePlayerRemoved = useCallback((id) => {
    setPlayers(prev => {
      const newPlayers = { ...prev };
      delete newPlayers[id];
      return newPlayers;
    });
  }, []);

  // Initialize player and set up subscriptions
  useEffect(() => {
    if (!playerName) return; // Don't initialize until player enters name

    // Initialize player with random position and color
    const playerData = {
      name: playerName,
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 600),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    // Add player to Firebase and set up subscriptions
    addPlayer(playerId, playerData);
    const unsubscribe = subscribeToPlayers(
      handlePlayerAdded,
      handlePlayerMoved,
      handlePlayerRemoved
    );

    // Cleanup on unmount
    return () => {
      unsubscribe();
      removePlayer(playerId);
    };
  }, [playerId, playerName, handlePlayerAdded, handlePlayerMoved, handlePlayerRemoved]);

  // Handle movement
  useEffect(() => {
    if (!playerName) return; // Don't handle movement until player enters name

    const handleKeyDown = (e) => {
      const speed = 10;
      const currentPlayer = players[playerId];
      if (!currentPlayer) return;

      let newX = currentPlayer.x;
      let newY = currentPlayer.y;

      switch (e.key.toLowerCase()) {
        case 'w':
          newY = Math.max(0, currentPlayer.y - speed);
          break;
        case 's':
          newY = Math.min(600 - 12, currentPlayer.y + speed);
          break;
        case 'a':
          newX = Math.max(0, currentPlayer.x - speed);
          break;
        case 'd':
          newX = Math.min(800 - 12, currentPlayer.x + speed);
          break;
        default:
          return;
      }

      if (newX !== currentPlayer.x || newY !== currentPlayer.y) {
        updatePlayerPosition(playerId, newX, newY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerId, players, playerName]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = e.target.playerName.value.trim();
    if (name) {
      setPlayerName(name);
    }
  };

  // Show name input if player hasn't entered their name
  if (!playerName) {
    return (
      <div className="game-container">
        <div className="name-input-container">
          <h2>Enter Your Name</h2>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              name="playerName"
              placeholder="Your name"
              maxLength={15}
              required
            />
            <button type="submit">Join Game</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-board">
        {Object.entries(players).map(([id, { x, y, color, name }]) => (
          <div
            key={id}
            className="player"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
              border: id === playerId ? '2px solid white' : 'none'
            }}
          >
            <div className="player-name">{name}</div>
          </div>
        ))}
      </div>
      
      <div className="debug-panel">
        <h3>Players in Game</h3>
        <p>Your Name: {playerName}</p>
        <p>Total Players: {Object.keys(players).length}</p>
        <ul>
          {Object.entries(players).map(([id, data]) => (
            <li key={id}>
              {id === playerId ? '(You) ' : ''}{data.name}: ({Math.round(data.x)}, {Math.round(data.y)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Game; 