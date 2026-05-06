import { io, Socket } from 'socket.io-client';
import { type Middleware } from 'redux';
import type { BodyGameAction, BodyGameEnd, BodyGameMalus, BodyGameNextPiece, BodyGameSpectrum, BodyGameStarted, BodyGameUpdate, BodyRoomJoin, BodyRoomLeave, BodyRoomPlayerMode, BodyRoomSettings, BodyRoomStartGame, BodyRoomUpdate } from '@shared/requestBody';
import { setSocketConnected, updateRoom } from '../gameRoom/logic/roomSlice';
import { applyMalus, endGame, generateNextPiece, initGame, updateGrid, updateNextPiece } from '../gameEngine/logic/gameSlice';
import { clearSpectrums, updateSpectrum } from '../gameEngine/data/spectrumsSlice';

export const socketMiddleware = (): Middleware => {
  let socket: Socket;

  return ({ dispatch, getState }) => (next) => (action: any) => {

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
      socket.on('room/gameUpdate', (data: BodyGameUpdate) => {
        dispatch({ type: 'room/gameUpdate', payload: data });
      });
      socket.on('room/nextPiece', (data: BodyGameNextPiece) => {
        dispatch({ type: 'room/nextPiece', payload: data });
      });
      socket.on('room/malus', (data: BodyGameMalus) => {
        dispatch({ type: 'room/malus', payload: data });
      });
      socket.on('room/gameSpectrum', (data: BodyGameSpectrum) => {
        dispatch({ type: 'room/gameSpectrum', payload: data });
      });
      socket.on('room/gameEnd', (data: BodyGameEnd) => {
        dispatch({ type: 'room/gameEnd', payload: data });
      });
      socket.on('room/gameFinished', () => {
        dispatch({ type: 'room/gameFinished' });
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
      dispatch(clearSpectrums());
      dispatch(initGame(action.payload));
      dispatch(updateRoom({isPlaying: true}));
    }

    // Case game update
    if (action.type === 'room/gameUpdate') {
      dispatch(updateGrid(action.payload.grid));
      if (action.payload.nextPiece != null) {
        dispatch(generateNextPiece(action.payload.nextPiece));
      }
    }

    // Case game spectrum update
    if (action.type === 'room/gameSpectrum') {
      dispatch(updateSpectrum(action.payload));
    }

    // Case game next piece update
    if (action.type === 'room/nextPiece') {
      dispatch(updateNextPiece(action.payload.nextPiece));
    }

    // Case game apply malus
    if (action.type === 'room/malus') {
      const state = getState();
      if (state.room.yourId != action.payload.playerId) {
        dispatch(applyMalus(action.payload.malusId));
      }
      // TODO: Popup display malus
    }

    // Case game end
    if (action.type === 'room/gameEnd') {
      dispatch(endGame(action.payload.win));
    }

    // Case game finished
    if (action.type === 'room/gameFinished') {
      dispatch(updateRoom({isPlaying: false}));
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

    // Case send game action
    if (action.type === 'game/action') {
      const body: BodyGameAction = {
        roomId: action.payload.roomId,
        action: action.payload.action,
      }
      socket.emit('game/action', body);
    }

    return next(action);
  };
};
