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
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, ${props => props.color}33 0%, transparent 70%);
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 1;
  }
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
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
`;

const PlayerCount = styled.div`
  position: absolute;
  top: -30px;
  right: -100px;
  background-color: #2a2a2a;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const GameField = ({ players }) => {
  const playerCount = Object.keys(players).length;

  return (
    <div style={{ position: 'relative' }}>
      <PlayerCount>
        {playerCount} Player{playerCount !== 1 ? 's' : ''} Online
      </PlayerCount>
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
    </div>
  );
};

export default GameField; 