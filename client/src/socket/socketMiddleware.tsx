import { io, Socket } from 'socket.io-client';
import { type Middleware } from 'redux';
import type { BodyGameStarted, BodyRoomJoin, BodyRoomLeave, BodyRoomPlayerMode, BodyRoomSettings, BodyRoomStartGame, BodyRoomUpdate } from '@shared/requestBody';
import { setSocketConnected, updateRoom } from '../gameRoom/logic/roomSlice';
import { initGame } from '../gameEngine/logic/gameSlice';


export const socketMiddleware = (): Middleware => {
  let socket: Socket;

  return ({ dispatch }) => (next) => (action: any) => {

    // SERVER -> CLIENT

    // Connection to server
    if (action.type === 'socket/connect') {
      // socket.close();
      socket = io('http://localhost:3000');
      dispatch(setSocketConnected(true));

      // Listen server reply
      socket.on('room/update', (data: BodyRoomUpdate) => {
        dispatch({ type: 'room/update', payload: data });
      });
      socket.on('room/gameStarted', (data: BodyGameStarted) => {
        dispatch({ type: 'room/gameStarted', payload: data });
      });

      socket.on('connect', () => console.log("Connecté avec l'ID:", socket.id));
    }

    // Case update room
    if (action.type === 'room/update') {
      dispatch(updateRoom({
        isAdmin: action.payload.isAdmin,
        isPlaying: action.payload.isPlaying,
        allPieces: action.payload.allPieces,
        malus: action.payload.malus,
        size: action.payload.size,
        gameSpeed: action.payload.gameSpeed,
        players: action.payload.players,
        spectators: action.payload.spectators,
        yourId: action.payload.yourId}));
    }

    // Case game started
    if (action.type === 'room/gameStarted') {
      dispatch(initGame({
        speed: action.payload.gameSpeed,
        allPieces: action.payload.allPieces,
        width: action.payload.size.w,
        height: action.payload.size.h,
        pieceId: action.payload.pieceId,
        nextPieceId: action.payload.nextPieceId,
      }));
      dispatch(updateRoom({isPlaying: true}));
    }

    // CLIENT -> SERVER

    // Case join room
    if (action.type === 'room/join') {
      const body: BodyRoomJoin = {
        roomId: action.payload.roomId,
        playerName: action.payload.playerName,
      }
      socket.emit('room/join', body);
    }

    // Case leave room
    if (action.type === 'room/leave') {
      const body: BodyRoomLeave = {
        roomId: action.payload.roomId,
      }
      socket.emit('room/leave', body);
    }

    // Case update room settings
    if (action.type === 'room/settings') {
      const body: BodyRoomSettings = {
        roomId: action.payload.roomId,
        allPieces: action.payload.allPieces,
        malus: action.payload.malus,
        size: action.payload.size,
        gameSpeed: action.payload.gameSpeed,
      }
      socket.emit('room/settings', body);
    }

    // Case change player mode
    if (action.type === 'room/playerMode') {
      const body: BodyRoomPlayerMode = {
        roomId: action.payload.roomId,
        spectate: action.payload.spectate,
      }
      socket.emit('room/playerMode', body);
    }

    // Case ask start game
    if (action.type === 'room/startGame') {
      const body: BodyRoomStartGame = {
        roomId: action.payload.roomId,
      }
      socket.emit('room/startGame', body);
    }

    return next(action);
  };
};
