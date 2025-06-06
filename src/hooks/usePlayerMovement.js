import { useEffect, useCallback, useState } from 'react';
import { updatePlayerPosition } from '../services/firebase';

const SPEED = 4;
const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;

export const usePlayerMovement = (playerId, initialX, initialY) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [pressedKeys, setPressedKeys] = useState(new Set());

  const movePlayer = useCallback((newX, newY) => {
    // Ensure the player stays within bounds
    const x = Math.max(0, Math.min(newX, FIELD_WIDTH));
    const y = Math.max(0, Math.min(newY, FIELD_HEIGHT));
    
    setPosition({ x, y });
    updatePlayerPosition(playerId, x, y);
  }, [playerId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!playerId) return;
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setPressedKeys(prev => new Set([...prev, key]));
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setPressedKeys(prev => {
          const newKeys = new Set([...prev]);
          newKeys.delete(key);
          return newKeys;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerId]);

  // Handle continuous movement
  useEffect(() => {
    if (!playerId || pressedKeys.size === 0) return;

    const moveInterval = setInterval(() => {
      let { x, y } = position;
      
      if (pressedKeys.has('w')) y -= SPEED;
      if (pressedKeys.has('s')) y += SPEED;
      if (pressedKeys.has('a')) x -= SPEED;
      if (pressedKeys.has('d')) x += SPEED;

      // Diagonal movement should not be faster
      if (pressedKeys.size > 1) {
        const diagonalSpeed = SPEED * 0.707; // Math.sqrt(2)/2
        const dx = x - position.x;
        const dy = y - position.y;
        x = position.x + dx * diagonalSpeed / SPEED;
        y = position.y + dy * diagonalSpeed / SPEED;
      }

      movePlayer(x, y);
    }, 16); // ~60fps

    return () => clearInterval(moveInterval);
  }, [playerId, pressedKeys, position, movePlayer]);

  return position;
};

export const GAME_CONFIG = {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  SPEED
}; 