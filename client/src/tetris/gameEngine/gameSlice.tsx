import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { allPieceIds, basicPieceIds, type PieceId, pieces } from './pieces';
import { rotations, type RotationId } from './rotations';
import { isPieceOverlap, kickTests } from './overlaps';

export interface GameState {
    speed: number;
    allPieces: boolean;
    waitNextPiece: boolean;
    isEnd: boolean;
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
        rotationId?: RotationId,
    };
    nextPiece: {
        cells: string[];
        width: number;
        height: number;
        rotationId?: RotationId,
    };
}

const initialState: GameState = {
    speed: 0,
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
            state.waitNextPiece = false;
            state.isEnd = false;

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
        generateNextPiece: (state, action: PayloadAction<PieceId>) => {
            const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
            state.piece = {...state.nextPiece, x: px, y: 0};

            console.log('test');

            const nextPiece = pieces[action.payload];
            state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};

            state.waitNextPiece = false;
        },
        movePiece: (state, action: PayloadAction<{right: boolean}>) => {
            if (state.waitNextPiece || state.isEnd) return;
            const newX = state.piece.x + (action.payload.right? 1 : -1);
            const newPiece = {...state.piece, x: newX};

            if (isPieceOverlap(state.grid, newPiece)) return;
            state.piece = newPiece;
        },
        rotatePiece: (state) => {
            if (state.waitNextPiece || state.isEnd) return;
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
            const newPiece = {...state.piece, y: state.piece.y + 1};

            if (isPieceOverlap(state.grid, newPiece)) {
                // TODO: Send msg to back instead, set wait piece
                console.log('Piece lock');
                if (state.allPieces) {
                    console.log('Random piece');
                    const nextPieceId = Math.floor(Math.random() * allPieceIds.length);

                    const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
                    state.piece = {...state.nextPiece, x: px, y: 0};

                    const nextPiece = pieces[allPieceIds[nextPieceId]];
                    state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};
                }
                else {
                    console.log('Random basic piece');
                    const nextPieceId = Math.floor(Math.random() * basicPieceIds.length);

                    const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
                    state.piece = {...state.nextPiece, x: px, y: 0};

                    const nextPiece = pieces[basicPieceIds[nextPieceId]];
                    state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};
                }
                return;
            }
            state.piece = newPiece;
        },
        hardDrop: (state) => {
            if (state.waitNextPiece || state.isEnd) return;
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

            // TODO: Send msg to back instead, set wait piece
            console.log('Piece lock');
            if (state.allPieces) {
                console.log('Random piece');
                const nextPieceId = Math.floor(Math.random() * allPieceIds.length);

                const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
                state.piece = {...state.nextPiece, x: px, y: 0};

                const nextPiece = pieces[allPieceIds[nextPieceId]];
                state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};
            }
            else {
                console.log('Random basic piece');
                const nextPieceId = Math.floor(Math.random() * basicPieceIds.length);

                const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
                state.piece = {...state.nextPiece, x: px, y: 0};

                const nextPiece = pieces[basicPieceIds[nextPieceId]];
                state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};
            }
            return;
        },
        tick: (state) => {
            if (state.waitNextPiece || state.isEnd) return;
            const newPiece = {...state.piece, y: state.piece.y + 1};

            if (isPieceOverlap(state.grid, newPiece)) {
                // TODO: Send msg to back instead, set wait piece
                console.log('Piece lock');
                if (state.allPieces) {
                    console.log('Random piece');
                    const nextPieceId = Math.floor(Math.random() * allPieceIds.length);

                    const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
                    state.piece = {...state.nextPiece, x: px, y: 0};

                    const nextPiece = pieces[allPieceIds[nextPieceId]];
                    state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};
                }
                else {
                    console.log('Random basic piece');
                    const nextPieceId = Math.floor(Math.random() * basicPieceIds.length);

                    const px = Math.floor(state.grid.width / 2) - Math.ceil(state.nextPiece.width / 2);
                    state.piece = {...state.nextPiece, x: px, y: 0};

                    const nextPiece = pieces[basicPieceIds[nextPieceId]];
                    state.nextPiece = {...nextPiece, width: nextPiece.size, height: nextPiece.size};
                }
                return;
            }
            state.piece = newPiece;
        }
    }
});

export const {
    initGame, updateGrid, generateNextPiece,
    movePiece, rotatePiece, softDrop, hardDrop, tick
} = gameSlice.actions;
export default gameSlice.reducer;
