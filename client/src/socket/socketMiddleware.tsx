import { io, Socket } from 'socket.io-client';
import { type Middleware } from 'redux';
import type { BodyRoomJoin, BodyRoomLeave, BodyRoomUpdate } from '@shared/requestBody';
import { setSocketConnected, updateRoom } from '../gameRoom/logic/roomSlice';


export const socketMiddleware = (): Middleware => {
  let socket: Socket;

  return ({ dispatch }) => (next) => (action: any) => {
    // Connection to server
    if (action.type === 'socket/connect') {
      // socket.close();
      socket = io('http://localhost:3000');
      dispatch(setSocketConnected(true));

      // Listen on roomUpdate
      socket.on('room/update', (data: BodyRoomUpdate) => {
        dispatch({ type: 'room/update', payload: data });
      });

      socket.on('connect', () => console.log("Connecté avec l'ID:", socket.id));
    }

    // Case join room
    if (action.type === 'room/join') {
      const body: BodyRoomJoin = {
        roomId: action.payload.id,
        playerName: action.payload.playerName,
      }
      socket.emit('room/join', body);
    }

    // Case leave room
    if (action.type === 'room/leave') {
      const body: BodyRoomLeave = {
        roomId: action.payload.id,
      }
      socket.emit('room/leave', body);
    }

    // Case update room
    if (action.type === 'room/update') {
      dispatch(updateRoom({
        isAdmin: action.payload.isAdmin,
        isPlaying: action.payload.isPlaying,
        allPieces: action.payload.allPieces,
        size: action.payload.size,
        gameSpeed: action.payload.gameSpeed,
        players: action.payload.players,
        spectators: action.payload.spectators}));
    }

    return next(action);
  };
};
