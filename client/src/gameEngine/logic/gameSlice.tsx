import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameData } from '../data/gameData';
import { isPieceOverlap, kickTests } from './overlaps';
import { rotations } from '../../../../shared/rotations';
import type { BodyGameStarted } from '@shared/requestBody';
import { pieces, type PieceId } from '@shared/pieces';

const initialState: GameData = {
    speed: {
        speed: 0,
        acceleration: false,
        frequency: 0,
        rate: 0,
        max: 0,
    },
    tickBeforeAccelerate: 0,
    allPieces: false,
    waitNextPiece: false,
    isEnd: false,
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
    },
    nextPiece: {
        cells: [],
        width: 0,
        height: 0,
    }
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        initGame: (
                state,
                action: PayloadAction<BodyGameStarted>) => {
            state.speed = {...action.payload.gameSpeed};
            state.tickBeforeAccelerate = state.speed.frequency;
            state.allPieces = action.payload.allPieces;
            state.waitNextPiece = false;
            state.isEnd = false;
            state.win = undefined;

            state.grid.width = action.payload.size.w;
            state.grid.height = action.payload.size.h;
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
        endGame: (state, action: PayloadAction<boolean>) => {
            state.isEnd = true;
            state.win = action.payload;
        },
        generateNextPiece: (state, action: PayloadAction<PieceId>) => {
            const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
            state.piece = {...state.nextPiece, x: px, y: 0};

            const nextPiece = pieces[action.payload];
            state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};

            state.waitNextPiece = false;
        },
        movePiece: (state, action: PayloadAction<{right: boolean}>) => {
            if (state.waitNextPiece || state.isEnd) return;
            if (state.piece.x == null || state.piece.y == null) return;
            const newX = state.piece.x + (action.payload.right? 1 : -1);
            const newPiece = {...state.piece, x: newX};

            if (isPieceOverlap(state.grid, newPiece)) return;
            state.piece = newPiece;
        },
        rotatePiece: (state) => {
            if (state.waitNextPiece || state.isEnd) return;
            if (state.piece.x == null || state.piece.y == null) return;
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
        },
        softDrop: (state) => {
            if (state.waitNextPiece || state.isEnd) return;
            if (state.piece.x == null || state.piece.y == null) return;
            const newPiece = {...state.piece, y: state.piece.y + 1};

            if (isPieceOverlap(state.grid, newPiece)) {
                state.waitNextPiece = true;
            } else {
                state.piece = newPiece;
            }
        },
        hardDrop: (state) => {
            if (state.waitNextPiece || state.isEnd) return;
            if (state.piece.x == null || state.piece.y == null) return;
            let newY = state.piece.y + 1;

            while (1) {
                const newPiece = {...state.piece, y: newY};
                if (isPieceOverlap(state.grid, newPiece)) {
                    newY -= 1;
                    break;
                }
                newY += 1;
            }

            state.piece = {...state.piece, y: newY};
            state.waitNextPiece = true;
        },
        tick: (state) => {
            if (state.waitNextPiece || state.isEnd) return;
            if (state.piece.x == null || state.piece.y == null) return;
            const newPiece = {...state.piece, y: state.piece.y + 1};

            // Update game speed
            if (state.speed.acceleration && state.speed.speed < state.speed.max) {
                state.tickBeforeAccelerate--;
                if (state.tickBeforeAccelerate <= 0) {
                    state.tickBeforeAccelerate = state.speed.frequency;
                    state.speed.speed += state.speed.rate;
                    if (state.speed.speed > state.speed.max) {
                        state.speed.speed = state.speed.max;
                    }
                }
            }

            if (isPieceOverlap(state.grid, newPiece)) {
                state.waitNextPiece = true;
            } else {
                state.piece = newPiece;
            }
        }
    }
});

export const {
    initGame, updateGrid, endGame, generateNextPiece,
    movePiece, rotatePiece, softDrop, hardDrop, tick
} = gameSlice.actions;
export default gameSlice.reducer;
