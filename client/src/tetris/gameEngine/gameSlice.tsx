import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type PieceId, pieces } from './pieces';
import { rotations, type RotationId } from './rotations';
import { isPieceOverlap, kickTests } from './overlaps';

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
        rotationId: RotationId | null,
    };
    nextPiece: {
        cells: string[];
        width: number;
        height: number;
        rotationId: RotationId | null,
    };
}

const initialState: GameState = {
    speed: 0,
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
        rotationId: null,
    },
    nextPiece: {
        cells: [],
        width: 0,
        height: 0,
        rotationId: null,
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
            const px = Math.floor(state.grid.width / 2) - Math.ceil(piece.size / 2);
            state.piece = {...piece, x: px, y:0, width: piece.size, height: piece.size};

            const nextPiece = pieces[action.payload.nextPieceId];
            state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};
        },
        updateGrid: (state, action: PayloadAction<string[]>) => {
            state.grid.cells = [...action.payload];
        },
        movePiece: (state, action: PayloadAction<{right: boolean}>) => {
            const newX = state.piece.x + (action.payload.right? 1 : -1);
            const newPiece = {...state.piece, x: newX};

            if (isPieceOverlap(state.grid, newPiece)) return;
            state.piece = newPiece;
        },
        rotatePiece: (state) => {
            if (state.piece.rotationId == null) return;
            const rotate = rotations[state.piece.rotationId];
            const rotatedCells = rotate(state.piece.cells);

            for (const test of kickTests) {
                const testPiece = {
                    ...state.piece,
                    cells: rotatedCells,
                    x: state.piece.x + test.dx,
                    y: state.piece.y + test.dy,
                };
                if (!isPieceOverlap(state.grid, testPiece)) {
                    state.piece = testPiece;
                    return;
                }
            }
        }
    }
});

export const { initGame, updateGrid, movePiece, rotatePiece } = gameSlice.actions;
export default gameSlice.reducer;
