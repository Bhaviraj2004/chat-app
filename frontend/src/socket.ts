// import { io } from 'socket.io-client';

// // Backend ka URL
// const URL = 'http://localhost:3000';

// export const socket = io(URL, {
//   autoConnect: false,
// });

import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});