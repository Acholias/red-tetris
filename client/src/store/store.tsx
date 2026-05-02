import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../gameEngine/logic/gameSlice';
import roomReducer from '../gameRoom/logic/roomSlice';
import themeReducer from '../theme/themeSlice';
import { socketMiddleware } from '../socket/socketMiddleware';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        room: roomReducer,
        theme: themeReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware())
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
