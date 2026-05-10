import { describe, it, expect } from 'vitest';
import roomReducer, { initGame, updateGrid, updateNextPiece, endGame, generateNextPiece, movePiece, rotatePiece, softDrop, hardDrop, tick, applyMalus } from './gameSlice';
import type { GameData } from '../data/gameData';
import type { BodyGameStarted } from '@shared/requestBody';
import type { PieceId } from '@shared/pieces';
import type { RotationId } from '@shared/rotations';

const defaultState: GameData = {
            speed: {
                speed: 2,
                acceleration: false,
                frequency: 60,
                rate: 1,
                max: 10,
            },
            tickBeforeAccelerate: 0,
            tickDrunk: 0,
            allPieces: false,
            waitNextPiece: false,
            isEnd: false,
            grid: {
                cells: [
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                ],
                width: 5,
                height: 5,
            },
            piece: {
                cells: [
                    ' ', 'S', 'S',
                    'S', 'S', ' ',
                    ' ', ' ', ' ',
                ],
                x: 1,
                y: 0,
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            },
            nextPiece: {
                cells: [
                    ' ', 'T', ' ',
                    'T', 'T', 'T',
                    ' ', ' ', ' ',
                ],
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            }
        } as GameData;


describe('initGame', () => {
    it('initGame', () => {
        // 1. Setup
        const initialState = {...defaultState};
        const gameStarted: BodyGameStarted = {
            allPieces: true,
            malus: true,
            size: {w: 5, h: 10},
            gameSpeed: {
                speed: 1,
                acceleration: true,
                frequency: 30,
                rate: 4,
                max: 20
            },
            pieceId: 'O',
            nextPieceId: 'z',
        };

        // 2. Action
        const action = initGame(gameStarted);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.speed.speed).toBe(1);
        expect(newState.speed.acceleration).toBe(true);
        expect(newState.speed.frequency).toBe(30);
        expect(newState.speed.rate).toBe(4);
        expect(newState.speed.max).toBe(20);
        expect(newState.tickBeforeAccelerate).toBe(30);
        expect(newState.tickDrunk).toBe(0);
        expect(newState.waitNextPiece).toBe(false);
        expect(newState.isEnd).toBe(false);
        expect(newState.win).toBe(undefined);
        expect(newState.grid.width).toBe(5);
        expect(newState.grid.height).toBe(10);
        expect(newState.grid.cells.length).toBe(5 * 10);
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
        expect(newState.piece.width).toBe(2);
        expect(newState.piece.height).toBe(2);
        expect(newState.piece.cells.length).toBe(2 * 2);
        expect(newState.piece.rotationId).toBe(undefined);
        expect(newState.nextPiece.x).toBe(undefined);
        expect(newState.nextPiece.y).toBe(undefined);
        expect(newState.nextPiece.width).toBe(3);
        expect(newState.nextPiece.height).toBe(3);
        expect(newState.nextPiece.cells.length).toBe(3 * 3);
        expect(newState.nextPiece.rotationId).toBe('3x3');
    });
});


describe('updateGrid', () => {
    it('updateGrid', () => {
        // 1. Setup
        const initialState = {...defaultState};
        const newGrid = [
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'S', 'E',
            'E', 'E', 'T', 'S', 'S',
            'E', 'T', 'T', 'T', 'S',
            'U', 'U', 'U', 'U', 'U',
        ]

        // 2. Action
        const action = updateGrid(newGrid);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.grid.cells).toStrictEqual(newGrid);
    });
});


describe('updateNextPiece', () => {
    it('updateNextPiece', () => {
        // 1. Setup
        const initialState = {...defaultState};
        const newPiece: PieceId = '5';

        // 2. Action
        const action = updateNextPiece(newPiece);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.nextPiece.x).toBe(undefined);
        expect(newState.nextPiece.y).toBe(undefined);
        expect(newState.nextPiece.width).toBe(5);
        expect(newState.nextPiece.height).toBe(5);
        expect(newState.nextPiece.cells.length).toBe(5 * 5);
        expect(newState.nextPiece.rotationId).toBe('5x5');
    });
});


describe('endGame', () => {
    it('endGame', () => {
        // 1. Setup
        const initialState = {...defaultState};

        // 2. Action
        const action = endGame(true);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.isEnd).toBe(true);
        expect(newState.win).toBe(true);
    });
});


describe('generateNextPiece', () => {
    it('generateNextPiece', () => {
        // 1. Setup
        const initialState = {...defaultState};
        const newPiece: PieceId = 'Y';

        // 2. Action
        const action = generateNextPiece(newPiece);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(0);
        expect(newState.piece.y).toBe(0);
        expect(newState.piece.width).toBe(3);
        expect(newState.piece.height).toBe(3);
        expect(newState.piece.cells.length).toBe(3 * 3);
        expect(newState.piece.rotationId).toBe('3x3');
        expect(newState.nextPiece.x).toBe(undefined);
        expect(newState.nextPiece.y).toBe(undefined);
        expect(newState.nextPiece.width).toBe(4);
        expect(newState.nextPiece.height).toBe(4);
        expect(newState.nextPiece.cells.length).toBe(4 * 4);
        expect(newState.nextPiece.rotationId).toBe('4x4');
        expect(newState.waitNextPiece).toBe(false);
    });
});


describe('movePiece', () => {
    it('wait next piece', () => {
        // 1. Setup
        const initialState = {...defaultState, waitNextPiece: true};

        // 2. Action
        const action = movePiece({right: false});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('is end', () => {
        // 1. Setup
        const initialState = {...defaultState, isEnd: true};

        // 2. Action
        const action = movePiece({right: false});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('no x', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: undefined,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = movePiece({right: false});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(undefined);
        expect(newState.piece.y).toBe(0);
    });

    it('no y', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: undefined,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = movePiece({right: false});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(undefined);
    });

    it('left', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = movePiece({right: false});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(0);
        expect(newState.piece.y).toBe(0);
    });

    it('left drunk', () => {
        // 1. Setup
        const initialState = {...defaultState,
            piece: {
                cells: [
                    ' ', 'S', 'S',
                    'S', 'S', ' ',
                    ' ', ' ', ' ',
                ],
                x: 1,
                y: 0,
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            },
            tickDrunk: 1,
        };

        // 2. Action
        const action = movePiece({right: false});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(2);
        expect(newState.piece.y).toBe(0);
    });

    it('right', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = movePiece({right: true});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(2);
        expect(newState.piece.y).toBe(0);
    });

    it('right overlap', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 2,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = movePiece({right: true});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(2);
        expect(newState.piece.y).toBe(0);
    });
});


describe('rotatePiece', () => {
    it('wait next piece', () => {
        // 1. Setup
        const initialState = {...defaultState, waitNextPiece: true};

        // 2. Action
        const action = rotatePiece();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('is end', () => {
        // 1. Setup
        const initialState = {...defaultState, isEnd: true};

        // 2. Action
        const action = rotatePiece();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('no x', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: undefined,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = rotatePiece();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(undefined);
        expect(newState.piece.y).toBe(0);
    });

    it('no y', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: undefined,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = rotatePiece();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(undefined);
    });

    it('no rotation id', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: 0,
            width: 3,
            height: 3,
            rotationId: undefined,
        }};

        // 2. Action
        const action = rotatePiece();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
        expect(newState.piece.cells).toStrictEqual([
            ' ', 'S', 'S',
            'S', 'S', ' ',
            ' ', ' ', ' ',
        ]);
    });

    it('rotation with a kick', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', ' ',
                ' ', 'S', 'S',
                ' ', ' ', 'S',
            ],
            x: -1,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = rotatePiece();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(0);
        expect(newState.piece.y).toBe(0);
        expect(newState.piece.cells).toStrictEqual([
            ' ', ' ', ' ',
            ' ', 'S', 'S',
            'S', 'S', ' ',
        ]);
    });
});


describe('softDrop', () => {
    it('wait next piece', () => {
        // 1. Setup
        const initialState = {...defaultState, waitNextPiece: true};

        // 2. Action
        const action = softDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('is end', () => {
        // 1. Setup
        const initialState = {...defaultState, isEnd: true};

        // 2. Action
        const action = softDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('no x', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: undefined,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = softDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(undefined);
        expect(newState.piece.y).toBe(0);
    });

    it('no y', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: undefined,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = softDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(undefined);
    });

    it('no overlap', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = softDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(1);
        expect(newState.waitNextPiece).toBe(false);
    });

    it('overlap', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: 3,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = softDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(3);
        expect(newState.waitNextPiece).toBe(true);
    });
});


describe('hardDrop', () => {
    it('wait next piece', () => {
        // 1. Setup
        const initialState = {...defaultState, waitNextPiece: true};

        // 2. Action
        const action = hardDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('is end', () => {
        // 1. Setup
        const initialState = {...defaultState, isEnd: true};

        // 2. Action
        const action = hardDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('no x', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: undefined,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = hardDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(undefined);
        expect(newState.piece.y).toBe(0);
    });

    it('no y', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: undefined,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = hardDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(undefined);
    });

    it('hard drop', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = hardDrop();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(3);
        expect(newState.waitNextPiece).toBe(true);
    });
});


describe('tick', () => {
    it('wait next piece', () => {
        // 1. Setup
        const initialState = {...defaultState, waitNextPiece: true};

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('is end', () => {
        // 1. Setup
        const initialState = {...defaultState, isEnd: true};

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('no x', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: undefined,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(undefined);
        expect(newState.piece.y).toBe(0);
    });

    it('no y', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: undefined,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(undefined);
    });

    it('tick no collid, update drunk, update speed', () => {
        // 1. Setup
        const initialState = {...defaultState,
            piece: {
                cells: [
                    ' ', 'S', 'S',
                    'S', 'S', ' ',
                    ' ', ' ', ' ',
                ],
                x: 1,
                y: 0,
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            },
            tickDrunk: 5,
            tickBeforeAccelerate: 1,
            speed: {
                speed: 9,
                acceleration: true,
                frequency: 60,
                rate: 2,
                max: 10,
            },
        };

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(1);
        expect(newState.waitNextPiece).toBe(false);
        expect(newState.tickBeforeAccelerate).toBe(60);
        expect(newState.speed.speed).toBe(10);
    });

    it('tick no collid, tick speed', () => {
        // 1. Setup
        const initialState = {...defaultState,
            piece: {
                cells: [
                    ' ', 'S', 'S',
                    'S', 'S', ' ',
                    ' ', ' ', ' ',
                ],
                x: 1,
                y: 0,
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            },
            tickDrunk: 5,
            tickBeforeAccelerate: 2,
            speed: {
                speed: 2,
                acceleration: true,
                frequency: 60,
                rate: 2,
                max: 10,
            },
        };

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(1);
        expect(newState.waitNextPiece).toBe(false);
        expect(newState.tickBeforeAccelerate).toBe(1);
        expect(newState.speed.speed).toBe(2);
    });

    it('tick no collid, update speed bellow max', () => {
        // 1. Setup
        const initialState = {...defaultState,
            piece: {
                cells: [
                    ' ', 'S', 'S',
                    'S', 'S', ' ',
                    ' ', ' ', ' ',
                ],
                x: 1,
                y: 0,
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            },
            tickDrunk: 5,
            tickBeforeAccelerate: 1,
            speed: {
                speed: 2,
                acceleration: true,
                frequency: 60,
                rate: 2,
                max: 10,
            },
        };

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(1);
        expect(newState.waitNextPiece).toBe(false);
        expect(newState.tickBeforeAccelerate).toBe(60);
        expect(newState.speed.speed).toBe(4);
    });

    it('tick collid, at max speed', () => {
        // 1. Setup
        const initialState = {...defaultState,
            piece: {
                cells: [
                    ' ', 'S', 'S',
                    'S', 'S', ' ',
                    ' ', ' ', ' ',
                ],
                x: 1,
                y: 3,
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            },
            tickBeforeAccelerate: 1,
            speed: {
                speed: 10,
                acceleration: true,
                frequency: 60,
                rate: 2,
                max: 10,
            },
        };

        // 2. Action
        const action = tick();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(3);
        expect(newState.waitNextPiece).toBe(true);
        expect(newState.tickBeforeAccelerate).toBe(1);
        expect(newState.speed.speed).toBe(10);
    });
});


describe('applyMalus', () => {
    it('fastForward wait next piece', () => {
        // 1. Setup
        const initialState = {...defaultState, waitNextPiece: true};

        // 2. Action
        const action = applyMalus('fastForward');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('fastForward is end', () => {
        // 1. Setup
        const initialState = {...defaultState, isEnd: true};

        // 2. Action
        const action = applyMalus('fastForward');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(0);
    });

    it('fastForward no x', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: undefined,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = applyMalus('fastForward');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(undefined);
        expect(newState.piece.y).toBe(0);
    });

    it('fastForward no y', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: undefined,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = applyMalus('fastForward');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(undefined);
    });

    it('fastForward collid', () => {
        // 1. Setup
        const initialState = {...defaultState, piece: {
            cells: [
                ' ', 'S', 'S',
                'S', 'S', ' ',
                ' ', ' ', ' ',
            ],
            x: 1,
            y: 0,
            width: 3,
            height: 3,
            rotationId: '3x3' as RotationId,
        }};

        // 2. Action
        const action = applyMalus('fastForward');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(3);
        expect(newState.waitNextPiece).toBe(true);
    });

    it('fastForward no collid', () => {
        // 1. Setup
        const initialState = {...defaultState,
            grid: {
                cells: [
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                    'E', 'E', 'E', 'E', 'E',
                ],
                width: 5,
                height: 10,
            },
            piece: {
                cells: [
                    ' ', 'S', 'S',
                    'S', 'S', ' ',
                    ' ', ' ', ' ',
                ],
                x: 1,
                y: 0,
                width: 3,
                height: 3,
                rotationId: '3x3' as RotationId,
            }
        };

        // 2. Action
        const action = applyMalus('fastForward');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(1);
        expect(newState.piece.y).toBe(5);
        expect(newState.waitNextPiece).toBe(false);
    });

    it('drunk', () => {
        // 1. Setup
        const initialState = {...defaultState};

        // 2. Action
        const action = applyMalus('drunk');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.tickDrunk).toBe(10);
    });

    it('merge', () => {
        // 1. Setup
        const initialState = {...defaultState};

        // 2. Action
        const action = applyMalus('merge');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.piece.x).toBe(0);
        expect(newState.piece.y).toBe(-1);
        expect(newState.piece.width).toBe(5);
        expect(newState.piece.height).toBe(5);
        expect(newState.piece.cells).toStrictEqual([
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', 'S', 'S', ' ',
            ' ', 'S', 'S', 'T', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ]);
        expect(newState.piece.rotationId).toBe('5x5');
    });

    it('unknow malus', () => {
        // 1. Setup
        const initialState = {...defaultState};

        // 2. Action
        const action = applyMalus(' ');
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState).toStrictEqual(initialState);
    });
});
