import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import  { blueTetrisTheme, themesData } from './themeData';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: blueTetrisTheme,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            const theme = themesData.get(action.payload);
            if (theme != null) state = theme;

            return state;
        },
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
