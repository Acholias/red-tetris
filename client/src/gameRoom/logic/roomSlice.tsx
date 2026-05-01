import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Room } from '../data/room';

const initialState: Room = {
    id: '',
    isSocketConnected: false,
    isAdmin: false,
    isPlaying: false,
    players: [],
    spectators: [],
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

            state.players = [{ id: 0, nickname: action.payload.playerName }];
            state.spectators = [];
        },
        updateRoom: (
            state,
            action: PayloadAction<{
                players: string[],
                spectators: string[],
                isAdmin?: boolean,
            }>) =>  {
            if (action.payload.isAdmin != null) {
                state.isAdmin = action.payload.isAdmin;
            }

            state.players = action.payload.players.map((player, index) => {return {id: index, nickname: player}});
            state.spectators = action.payload.spectators.map((spectator, index) => {return {id: index, nickname: spectator}});
        },
    }
});

export const {
    setSocketConnected,
    initRoom, updateRoom
} = roomSlice.actions;
export default roomSlice.reducer;
