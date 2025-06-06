import { useState, useEffect } from 'react';
import { subscribeToPlayers } from '../services/firebase';

export const useRealtimePlayers = () => {
  const [players, setPlayers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    try {
      const handlePlayerAdded = (playerId, playerData) => {
        setPlayers(prev => ({
          ...prev,
          [playerId]: playerData
        }));
      };

      const handlePlayerMoved = (playerId, playerData) => {
        setPlayers(prev => ({
          ...prev,
          [playerId]: {
            ...prev[playerId],
            ...playerData
          }
        }));
      };

      const handlePlayerRemoved = (playerId) => {
        setPlayers(prev => {
          const newPlayers = { ...prev };
          delete newPlayers[playerId];
          return newPlayers;
        });
      };

      // Subscribe to player changes
      unsubscribe = subscribeToPlayers(
        handlePlayerAdded,
        handlePlayerMoved,
        handlePlayerRemoved
      );
    } catch (err) {
      console.error('Error in useRealtimePlayers:', err);
      setError(err.message);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (error) {
    console.error('useRealtimePlayers error:', error);
  }

  return players;
}; 