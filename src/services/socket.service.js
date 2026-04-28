import { io } from 'socket.io-client';

let socketInstance = null;
let registeredUserId = null;

export function getSocket() {
  if (socketInstance) return socketInstance;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace(/\/?api\/?$/, '');

  socketInstance = io(baseUrl, {
    withCredentials: true,
    autoConnect: false,
  });

  return socketInstance;
}

export function connectSocket(userId) {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  if (userId && registeredUserId !== userId) {
    socket.emit('register', { userId });
    registeredUserId = userId;
  }

  return socket;
}

export function disconnectSocket() {
  const socket = getSocket();
  if (socket.connected) {
    socket.disconnect();
  }
  registeredUserId = null;
} 