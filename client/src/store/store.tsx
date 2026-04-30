import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../gameEngine/logic/gameSlice';
import roomReducer from '../gameRoom/logic/roomSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        room: roomReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
