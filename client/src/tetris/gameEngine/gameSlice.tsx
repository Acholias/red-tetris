import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
    speed: number;
    allPieces: boolean;
    grid: {
        cells: string[];
        width: number;
        height: number;
    };
    piece: {
        cells: string[];
        x: number;
        y: number;
        width: number;
        height: number;
    };
    nextPiece: {
        cells: string[];
        width: number;
        height: number;
    };
}

const initialState: GameState = {
    speed: 0.5,
    allPieces: false,
    grid: {
        cells: Array(200).fill('E'),
        width: 10,
        height: 20,
    },
    piece: {
        cells: [' ', 'T', ' ', 'T', 'T', 'T', ' ', ' ', ' '],
        x: 1,
        y: 2,
        width: 3,
        height: 3,
    },
    nextPiece: {
        cells: [' ', 'Z', 'Z', 'Z', 'Z', ' ', ' ', ' ', ' '],
        width: 3,
        height: 3,
    }
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        initGame: (
                state,
                action: PayloadAction<{
                    speed: number,
                    allPieces: boolean,
                    width: number,
                    height: number
                }>) => {
            state.speed = action.payload.speed;
            state.allPieces = action.payload.allPieces;

            state.grid.width = action.payload.width;
            state.grid.height = action.payload.height;
            state.grid.cells = Array(state.grid.width * state.grid.height).fill('E');
        },
        updateGrid: (state, action: PayloadAction<string[]>) => {
            state.grid.cells = action.payload;
        },
        movePiece: (state, action: PayloadAction<{right: boolean}>) => {
            let piece = state.piece;

            if (action.payload.right) {
                piece.x += 1;
            } else {
                piece.x -= 1;
            }

            // TODO: Check overlap
            state.piece = piece;
        }
    }
});

export const { initGame, updateGrid, movePiece } = gameSlice.actions;
export default gameSlice.reducer;
