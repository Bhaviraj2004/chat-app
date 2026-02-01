import { io } from 'socket.io-client';

// Backend ka URL
const URL = 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false,
});