import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type PieceId, type RotateFunction, pieces } from './pieces';

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
        rotate: RotateFunction | null;
    };
    nextPiece: {
        cells: string[];
        width: number;
        height: number;
        rotate: RotateFunction | null;
    };
}

const initialState: GameState = {
    speed: 0.5,
    allPieces: false,
    grid: {
        cells: [],
        width: 0,
        height: 0,
    },
    piece: {
        cells: [],
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotate: null,
    },
    nextPiece: {
        cells: [],
        width: 0,
        height: 0,
        rotate: null,
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
                    height: number,
                    pieceId: PieceId,
                    nextPieceId: PieceId,
                }>) => {
            state.speed = action.payload.speed;
            state.allPieces = action.payload.allPieces;

            state.grid.width = action.payload.width;
            state.grid.height = action.payload.height;
            state.grid.cells = Array(state.grid.width * state.grid.height).fill('E');

            const piece = pieces[action.payload.pieceId];
            state.piece.cells = [...piece.cells];
            state.piece.x = Math.floor(state.grid.width / 2) - Math.floor(piece.width / 2);
            state.piece.y = 0;
            state.piece.width = piece.width;
            state.piece.height = piece.height;
            state.piece.rotate = piece.rotate;

            const nextPiece = pieces[action.payload.nextPieceId];
            state.nextPiece.cells = [...nextPiece.cells];
            state.nextPiece.width = nextPiece.width;
            state.nextPiece.height = nextPiece.height;
            state.nextPiece.rotate = nextPiece.rotate;
        },
        updateGrid: (state, action: PayloadAction<string[]>) => {
            state.grid.cells = action.payload;
        },
        movePiece: (state, action: PayloadAction<{right: boolean}>) => {
            const piece = state.piece;

            if (action.payload.right) {
                piece.x += 1;
            } else {
                piece.x -= 1;
            }

            // TODO: Check overlap
            state.piece = piece;
        },
        rotatePiece: (state) => {
            let piece = state.piece;
            if (piece.rotate == null) return;

            piece.cells = piece.rotate(piece.cells);

            // TODO: Check overlap
            state.piece = piece;
        }
    }
});

export const { initGame, updateGrid, movePiece, rotatePiece } = gameSlice.actions;
export default gameSlice.reducer;
