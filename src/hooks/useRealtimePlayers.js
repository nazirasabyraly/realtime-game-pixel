import { useState, useEffect } from 'react';
import { subscribeToPlayers } from '../services/firebase';

export const useRealtimePlayers = () => {
  const [players, setPlayers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Setting up player subscriptions...');
    let unsubscribe;
    try {
      const handlePlayerAdded = (playerId, playerData) => {
        console.log('Player added:', playerId, playerData);
        setPlayers(prev => {
          const newPlayers = {
            ...prev,
            [playerId]: playerData
          };
          console.log('Updated players state:', newPlayers);
          return newPlayers;
        });
      };

      const handlePlayerMoved = (playerId, playerData) => {
        console.log('Player moved:', playerId, playerData);
        setPlayers(prev => {
          const newPlayers = {
            ...prev,
            [playerId]: {
              ...prev[playerId],
              ...playerData
            }
          };
          return newPlayers;
        });
      };

      const handlePlayerRemoved = (playerId) => {
        console.log('Player removed:', playerId);
        setPlayers(prev => {
          const newPlayers = { ...prev };
          delete newPlayers[playerId];
          console.log('Updated players after removal:', newPlayers);
          return newPlayers;
        });
      };

      // Subscribe to player changes
      unsubscribe = subscribeToPlayers(
        handlePlayerAdded,
        handlePlayerMoved,
        handlePlayerRemoved
      );

      console.log('Successfully subscribed to player changes');
    } catch (err) {
      console.error('Error in useRealtimePlayers:', err);
      setError(err.message);
    }

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up player subscriptions...');
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