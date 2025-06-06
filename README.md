# Realtime Pixel Game

A multiplayer real-time pixel game built with React and Firebase where each player controls a colored pixel on a shared game field.

## Features

- Real-time multiplayer interaction
- Each player is represented by a unique colored pixel
- WASD controls for movement
- Player name customization
- Real-time synchronization using Firebase Realtime Database
- Smooth animations and movement

## Technologies Used

- React 18
- Firebase Realtime Database
- Styled Components
- Vite

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/realtime-game-pixel.git
cd realtime-game-pixel
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Realtime Database
   - Copy your Firebase configuration to `src/services/firebase.js`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Game Controls

- W: Move Up
- A: Move Left
- S: Move Down
- D: Move Right

## Contributing

Feel free to submit issues and pull requests.

## License

MIT
