import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Room } from '../data/room';

const initialState: Room = {
    id: 0,
    players: [],
    spectators: [],
};

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        initRoom: (
                state,
                action: PayloadAction<{
                    id: number,
                }>) => {
            state.id = action.payload.id;

            state.players = [
                { nickname: 'Gugus', pp: 0 },
                { nickname: 'Lucas', pp: 0 },
                { nickname: 'Terry', pp: 0 },
            ];

            state.spectators = [
                { nickname: 'Joris', pp: 0 },
            ];
        }
    }
});

export const {
    initRoom
} = roomSlice.actions;
export default roomSlice.reducer;
