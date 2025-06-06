import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onDisconnect, onChildAdded, onChildChanged, onChildRemoved, update, onValue } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJPsQqddhvxQPKiqclxRc4edF-V05WQYU",
    authDomain: "realtime-game-pixel.firebaseapp.com",
    databaseURL: "https://realtime-game-pixel-default-rtdb.firebaseio.com",
    projectId: "realtime-game-pixel",
    storageBucket: "realtime-game-pixel.firebasestorage.app",
    messagingSenderId: "621651138020",
    appId: "1:621651138020:web:1ae050ddc8ffa1b853e3f1",
    measurementId: "G-JWT0SWQZWJ"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const addPlayer = async (playerId, playerData) => {
  try {
    const playerRef = ref(database, `players/${playerId}`);
    await set(playerRef, playerData);
    onDisconnect(playerRef).remove();
    return true;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const updatePlayerPosition = async (playerId, x, y) => {
  try {
    const playerRef = ref(database, `players/${playerId}`);
    await update(playerRef, { x, y });
  } catch (error) {
    console.error('Error updating position:', error);
  }
};

export const subscribeToPlayers = (onPlayerAdded, onPlayerMoved, onPlayerRemoved) => {
  const playersRef = ref(database, 'players');

  // Get initial state and subscribe to changes
  onValue(playersRef, (snapshot) => {
    const players = snapshot.val() || {};
    Object.entries(players).forEach(([id, data]) => {
      onPlayerAdded(id, data);
    });
  });
  
  // Listen for changes
  const addedUnsubscribe = onChildAdded(playersRef, (snapshot) => {
    onPlayerAdded(snapshot.key, snapshot.val());
  });
  
  const changedUnsubscribe = onChildChanged(playersRef, (snapshot) => {
    onPlayerMoved(snapshot.key, snapshot.val());
  });
  
  const removedUnsubscribe = onChildRemoved(playersRef, (snapshot) => {
    onPlayerRemoved(snapshot.key);
  });

  return () => {
    addedUnsubscribe();
    changedUnsubscribe();
    removedUnsubscribe();
  };
};

export const removePlayer = async (playerId) => {
  try {
    const playerRef = ref(database, `players/${playerId}`);
    await set(playerRef, null);
  } catch (error) {
    console.error('Error removing player:', error);
  }
}; 