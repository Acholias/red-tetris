import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Room } from '../data/room';
import type { BodyRoomUpdate } from '@shared/requestBody';

const initialState: Room = {
    id: '',
    isSocketConnected: false,
    isAdmin: false,
    isPlaying: false,
    allPieces: false,
    size: {w: 0, h: 0},
    gameSpeed: 0,
    players: [],
    spectators: [],
    yourId: -2,
};

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setSocketConnected: (state, action: PayloadAction<boolean>) => {
            state.isSocketConnected = action.payload;
        },
        initRoom: (
                state,
                action: PayloadAction<{
                    id: string,
                    playerName: string,
                }>) => {
            state.id = action.payload.id;
            state.isPlaying = false;
            state.isAdmin = false;
            state.allPieces = false;
            state.size = {w: 10, h: 20};
            state.gameSpeed = 0.5;

            state.players = [{ id: 0, name: action.payload.playerName }];
            state.spectators = [];
        },
        updateRoom: (
            state,
            action: PayloadAction<BodyRoomUpdate>) =>  {
            if (action.payload.isAdmin != null) {
                state.isAdmin = action.payload.isAdmin;
            }
            if (action.payload.isPlaying != null) {
                state.isPlaying = action.payload.isPlaying;
            }
            if (action.payload.allPieces != null) {
                state.allPieces = action.payload.allPieces;
            }
            if (action.payload.size != null) {
                state.size = action.payload.size;
            }
            if (action.payload.gameSpeed != null) {
                state.gameSpeed = action.payload.gameSpeed;
            }
            if (action.payload.players != null) {
                state.players = action.payload.players;
            }
            if (action.payload.spectators != null) {
                state.spectators = action.payload.spectators;
            }
            if (action.payload.yourId != null) {
                state.yourId = action.payload.yourId;
            }
        },
    }
});

export const {
    setSocketConnected,
    initRoom, updateRoom
} = roomSlice.actions;
export default roomSlice.reducer;
