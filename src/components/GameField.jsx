import React from 'react';
import styled from 'styled-components';
import { GAME_CONFIG } from '../hooks/usePlayerMovement';

const GameContainer = styled.div`
  width: ${GAME_CONFIG.FIELD_WIDTH}px;
  height: ${GAME_CONFIG.FIELD_HEIGHT}px;
  background-color: #1a1a1a;
  position: relative;
  margin: 20px auto;
  border: 2px solid #333;
`;

const Player = styled.div`
  width: 12px;
  height: 12px;
  position: absolute;
  background-color: ${props => props.color};
  transform: translate(-50%, -50%);
  transition: all 0.05s linear;
  border-radius: 2px;
  box-shadow: 0 0 8px ${props => props.color};
`;

const PlayerName = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: ${props => props.color};
  white-space: nowrap;
  font-size: 12px;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
`;

const GameField = ({ players }) => {
  return (
    <GameContainer>
      {Object.entries(players).map(([playerId, player]) => (
        <Player
          key={playerId}
          style={{
            left: `${player.x}px`,
            top: `${player.y}px`
          }}
          color={player.color}
        >
          <PlayerName color={player.color}>
            {player.name}
          </PlayerName>
        </Player>
      ))}
    </GameContainer>
  );
};

export default GameField; 