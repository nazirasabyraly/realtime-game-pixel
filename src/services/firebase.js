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

let app;
let database;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  
  // Monitor connection state
  const connectedRef = ref(database, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      console.log('Connected to Firebase');
    } else {
      console.log('Not connected to Firebase');
    }
  });

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Player management functions with error handling
export const addPlayer = async (playerId, playerData) => {
  try {
    console.log('Adding player:', playerId, playerData);
    const playerRef = ref(database, `players/${playerId}`);
    await set(playerRef, playerData);
    
    // Remove player data when they disconnect
    onDisconnect(playerRef).remove();

    // Verify the player was added by reading it back
    onValue(playerRef, (snapshot) => {
      console.log('Player data verified:', snapshot.val());
    }, { onlyOnce: true });

    console.log('Player added successfully:', playerId);
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const updatePlayerPosition = async (playerId, x, y) => {
  if (!playerId) {
    console.error('Attempted to update position without playerId');
    return;
  }

  try {
    const playerRef = ref(database, `players/${playerId}`);
    await update(playerRef, { x, y });
  } catch (error) {
    console.error('Error updating player position:', error);
    // Don't throw here to prevent movement interruption
  }
};

export const subscribeToPlayers = (onPlayerAdded, onPlayerMoved, onPlayerRemoved) => {
  try {
    console.log('Setting up player subscriptions...');
    const playersRef = ref(database, 'players');

    // First, get all existing players
    onValue(playersRef, (snapshot) => {
      console.log('Initial players data:', snapshot.val());
    }, { onlyOnce: true });
    
    const childAddedUnsubscribe = onChildAdded(playersRef, (snapshot) => {
      console.log('Player added event:', snapshot.key, snapshot.val());
      onPlayerAdded(snapshot.key, snapshot.val());
    });
    
    const childChangedUnsubscribe = onChildChanged(playersRef, (snapshot) => {
      console.log('Player changed event:', snapshot.key, snapshot.val());
      onPlayerMoved(snapshot.key, snapshot.val());
    });
    
    const childRemovedUnsubscribe = onChildRemoved(playersRef, (snapshot) => {
      console.log('Player removed event:', snapshot.key);
      onPlayerRemoved(snapshot.key);
    });

    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from player events...');
      childAddedUnsubscribe();
      childChangedUnsubscribe();
      childRemovedUnsubscribe();
    };
  } catch (error) {
    console.error('Error subscribing to players:', error);
    throw error;
  }
};

export const removePlayer = async (playerId) => {
  try {
    console.log('Removing player:', playerId);
    const playerRef = ref(database, `players/${playerId}`);
    await set(playerRef, null);
    console.log('Player removed successfully:', playerId);
  } catch (error) {
    console.error('Error removing player:', error);
    throw error;
  }
}; 