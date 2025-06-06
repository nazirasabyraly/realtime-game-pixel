import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import GameField from './components/GameField';
import PlayerList from './components/PlayerList';
import LoginForm from './components/LoginForm';
import { usePlayerMovement, GAME_CONFIG } from './hooks/usePlayerMovement';
import { useRealtimePlayers } from './hooks/useRealtimePlayers';
import { addPlayer, removePlayer } from './services/firebase';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const GameContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const Instructions = styled.div`
  color: #666;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  background-color: #2a2a2a;
  padding: 15px;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage>Something went wrong. Please refresh the page.</ErrorMessage>;
    }
    return this.props.children;
  }
}

function App() {
  const [playerId] = useState(() => uuidv4());
  const [playerName, setPlayerName] = useState('');
  const [playerColor] = useState(() => 
    `hsl(${Math.random() * 360}, 70%, 50%)`
  );
  const [error, setError] = useState(null);
  
  const players = useRealtimePlayers();
  
  // Initialize player position at the center of the field
  const initialX = Math.floor(GAME_CONFIG.FIELD_WIDTH / 2);
  const initialY = Math.floor(GAME_CONFIG.FIELD_HEIGHT / 2);
  
  const position = usePlayerMovement(playerName ? playerId : null, initialX, initialY);

  useEffect(() => {
    if (playerName) {
      try {
        // Add player to the game
        addPlayer(playerId, {
          name: playerName,
          color: playerColor,
          x: position.x,
          y: position.y
        });

        // Remove player when component unmounts
        return () => {
          try {
            removePlayer(playerId);
          } catch (err) {
            console.error('Error removing player:', err);
          }
        };
      } catch (err) {
        setError(err.message);
        console.error('Error adding player:', err);
      }
    }
  }, [playerId, playerName, playerColor, position.x, position.y]);

  if (error) {
    return (
      <AppContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </AppContainer>
    );
  }

  if (!playerName) {
    return (
      <AppContainer>
        <LoginForm onSubmit={setPlayerName} />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <GameContainer>
          <PlayerList players={players} />
          <GameField players={players} />
        </GameContainer>
        <Instructions>
          Use W/A/S/D keys to move your pixel
        </Instructions>
      </ErrorBoundary>
    </AppContainer>
  );
}

export default App;
