import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  width: 200px;
  background-color: #2a2a2a;
  padding: 15px;
  border-radius: 8px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  color: #fff;
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlayerCount = styled.span`
  font-size: 14px;
  color: #888;
`;

const PlayerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #333;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #444;
  }
`;

const ColorIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
  box-shadow: 0 0 4px ${props => props.color};
`;

const PlayerName = styled.span`
  color: #fff;
  font-size: 14px;
  flex-grow: 1;
`;

const NoPlayers = styled.div`
  color: #666;
  text-align: center;
  padding: 20px;
  font-size: 14px;
`;

const PlayerList = ({ players }) => {
  const playerCount = Object.keys(players).length;

  return (
    <ListContainer>
      <Title>
        Active Players
        <PlayerCount>{playerCount}</PlayerCount>
      </Title>
      {playerCount === 0 ? (
        <NoPlayers>No players online</NoPlayers>
      ) : (
        Object.entries(players).map(([playerId, player]) => (
          <PlayerItem key={playerId}>
            <ColorIndicator color={player.color} />
            <PlayerName>{player.name}</PlayerName>
          </PlayerItem>
        ))
      )}
    </ListContainer>
  );
};

export default PlayerList; 