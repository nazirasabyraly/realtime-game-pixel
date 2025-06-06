import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  width: 200px;
  background-color: #2a2a2a;
  padding: 15px;
  border-radius: 8px;
  margin: 20px;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 18px;
  margin-bottom: 15px;
`;

const PlayerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 5px;
  background-color: #333;
  border-radius: 4px;
`;

const ColorIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
`;

const PlayerName = styled.span`
  color: #fff;
  font-size: 14px;
`;

const PlayerList = ({ players }) => {
  return (
    <ListContainer>
      <Title>Active Players</Title>
      {Object.entries(players).map(([playerId, player]) => (
        <PlayerItem key={playerId}>
          <ColorIndicator color={player.color} />
          <PlayerName>{player.name}</PlayerName>
        </PlayerItem>
      ))}
    </ListContainer>
  );
};

export default PlayerList; 