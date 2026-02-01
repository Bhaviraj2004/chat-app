// import { io } from 'socket.io-client';

// // Backend ka URL
// const URL = 'http://localhost:3000';

// export const socket = io(URL, {
//   autoConnect: false,
// });













import { io } from "socket.io-client";

export const socket = io("https://chat-backend.onrender.com", {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

// Debug logs
socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});