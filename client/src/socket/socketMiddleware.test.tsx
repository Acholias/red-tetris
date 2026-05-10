import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socketMiddleware } from './socketMiddleware';
import { updateRoom } from '../gameRoom/logic/roomSlice';
import { applyMalus, endGame, generateNextPiece, initGame, updateGrid, updateNextPiece } from '../gameEngine/logic/gameSlice';
import { clearSpectrums, updateSpectrum } from '../gameEngine/logic/spectrumsSlice';


// Mock socket.io
let socketHandlers: Record<string, Function> = {};
const mockEmit = vi.fn();
const mockOn = vi.fn((eventName: string, callback: Function) => {
    socketHandlers[eventName] = callback;
});

vi.mock('socket.io-client', () => {
    return {
        io: vi.fn(() => ({
            emit: mockEmit,
            on: mockOn,
            id: 'fake-socket-id'
        }))
    };
});


describe('socketMiddleware', () => {
    let store: any;
    let next: any;
    let invoke: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock redux store
        store = {
            dispatch: vi.fn(),
            getState: vi.fn(() => ({
                room: { yourId: 0 }
            }))
        };

        // Mock text function
        next = vi.fn();

        // Mock callback function
        const middleware = socketMiddleware();
        invoke = (action: any) => middleware(store)(next)(action);
    });

    it('check next', () => {
        // 1. Setup
        const action = { type: 'uwu' };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(next).toHaveBeenCalledWith(action); // Must always call next
    });

    // -----------------------------------------------------------------------
    // Server -> Client
    // -----------------------------------------------------------------------
    it('socket.on("room/update")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {
            isAdmin: true,
            isPlaying: true,
            yourId: 42
        };

        // 2. Action
        socketHandlers['room/update'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/update',
            payload: fakeServerData
        });
    });

    it('socket.on("room/gameStarted")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 2,
                acceleration: false,
                frequency: 60,
                rate: 1,
                max: 10
            },
            pieceId: 's',
            nextPieceId: 'z',
        };

        // 2. Action
        socketHandlers['room/gameStarted'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/gameStarted',
            payload: fakeServerData
        });
    });

    it('socket.on("room/gameUpdate")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {
            grid: ['X'],
            nextPiece: 's',
        };

        // 2. Action
        socketHandlers['room/gameUpdate'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/gameUpdate',
            payload: fakeServerData
        });
    });

    it('socket.on("room/nextPiece")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {
            nextPiece: 's',
        };

        // 2. Action
        socketHandlers['room/nextPiece'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/nextPiece',
            payload: fakeServerData
        });
    });

    it('socket.on("room/malus")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {
            playerId: 0,
            malusId: 'drunk',
        };

        // 2. Action
        socketHandlers['room/malus'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/malus',
            payload: fakeServerData
        });
    });

    it('socket.on("room/gameSpectrum")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {
            playerId: 0,
            spectrum: {
                heights: [0],
                unbreakableLines: 0
            },
        };

        // 2. Action
        socketHandlers['room/gameSpectrum'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/gameSpectrum',
            payload: fakeServerData
        });
    });

    it('socket.on("room/gameEnd")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {
            win: true
        };

        // 2. Action
        socketHandlers['room/gameEnd'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/gameEnd',
            payload: fakeServerData
        });
    });

    it('socket.on("room/gameFinished")', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        store.dispatch.mockClear();

        const fakeServerData = {};

        // 2. Action
        socketHandlers['room/gameFinished'](fakeServerData);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'room/gameFinished',
        });
    });

    // -----------------------------------------------------------------------
    // Client -> call slice
    // -----------------------------------------------------------------------

    it('room/update', () => {
        // 1. Setup
        const action = {
            type: 'room/update',
            payload: {
                isAdmin: true,
                isPlaying: false,
                size: { w: 10, h: 20 },
                players: [{ id: 1, name: 'aderouba' }]
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            updateRoom({
                isAdmin: true,
                isPlaying: false,
                allPieces: undefined,
                malus: undefined,
                size: { w: 10, h: 20 },
                gameSpeed: undefined,
                players: [{ id: 1, name: 'aderouba' }],
                spectators: undefined,
                yourId: undefined
            })
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/gameStarted', () => {
        // 1. Setup
        const action = {
            type: 'room/gameStarted',
            payload: {
                allPieces: false,
                malus: false,
                size: {w: 10, h: 20},
                gameSpeed: {
                    speed: 2,
                    acceleration: false,
                    frequency: 60,
                    rate: 1,
                    max: 10
                },
                pieceId: 's',
                nextPieceId: 'z',
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            clearSpectrums()
        );
        expect(store.dispatch).toHaveBeenCalledWith(
            initGame({
                 allPieces: false,
                malus: false,
                size: {w: 10, h: 20},
                gameSpeed: {
                    speed: 2,
                    acceleration: false,
                    frequency: 60,
                    rate: 1,
                    max: 10
                },
                pieceId: 's',
                nextPieceId: 'z',
            })
        );
        expect(store.dispatch).toHaveBeenCalledWith(
            updateRoom({
                isPlaying: true
            })
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/gameUpdate without next piece', () => {
        // 1. Setup
        const action = {
            type: 'room/gameUpdate',
            payload: {
                grid: ['X'],
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            updateGrid(['X'])
        );
        expect(store.dispatch).toHaveBeenCalledOnce();

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/gameUpdate with next piece', () => {
        // 1. Setup
        const action = {
            type: 'room/gameUpdate',
            payload: {
                grid: ['X'],
                nextPiece: 's',
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            updateGrid(['X'])
        );
        expect(store.dispatch).toHaveBeenCalledWith(
            generateNextPiece('s')
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/gameSpectrum', () => {
        // 1. Setup
        const action = {
            type: 'room/gameSpectrum',
            payload: {
                playerId: 0,
                spectrum: {
                    heights: [0],
                    unbreakableLines: 0
                },
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            updateSpectrum({
                playerId: 0,
                spectrum: {
                    heights: [0],
                    unbreakableLines: 0
                },
            })
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/nextPiece', () => {
        // 1. Setup
        const action = {
            type: 'room/nextPiece',
            payload: {
                nextPiece: 's',
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            updateNextPiece('s')
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/malus, skip malus', () => {
        // 1. Setup
        const action = {
            type: 'room/malus',
            payload: {
                playerId: 0,
                malusId: 'drunk',
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/malus, malus call', () => {
        // 1. Setup
        const action = {
            type: 'room/malus',
            payload: {
                playerId: 1,
                malusId: 'drunk',
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            applyMalus('drunk')
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/gameEnd', () => {
        // 1. Setup
        const action = {
            type: 'room/gameEnd',
            payload: {
                win: true,
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            endGame(true)
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room/gameFinished', () => {
        // 1. Setup
        const action = {
            type: 'room/gameFinished',
            payload: {}
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(store.dispatch).toHaveBeenCalledWith(
            updateRoom({isPlaying: false})
        );

        expect(next).toHaveBeenCalledWith(action);
    });

    // -----------------------------------------------------------------------
    // Client -> Server
    // -----------------------------------------------------------------------

    it('join room', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        const action = {
            type: 'room/join',
            payload: { roomId: 'room-42', playerName: 'aderouba' }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(mockEmit).toHaveBeenCalledWith('room/join', {
            roomId: 'room-42',
            playerName: 'aderouba'
        });

        expect(next).toHaveBeenCalledWith(action);
    });

    it('leave room', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        const action = {
            type: 'room/leave',
            payload: { roomId: 'room-42' }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(mockEmit).toHaveBeenCalledWith('room/leave', {
            roomId: 'room-42',
        });

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room settings', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        const action = {
            type: 'room/settings',
            payload: {
                roomId: 'room-42',
                allPieces: true,
                malus: true,
                size: {w: 10, h: 20},
                gameSpeed: {
                    speed: 2,
                    acceleration: false,
                    frequency: 60,
                    rate: 1,
                    max: 10
                },
            }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(mockEmit).toHaveBeenCalledWith('room/settings', {
            roomId: 'room-42',
            allPieces: true,
            malus: true,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 2,
                acceleration: false,
                frequency: 60,
                rate: 1,
                max: 10
            },
        });

        expect(next).toHaveBeenCalledWith(action);
    });

    it('room player mode', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        const action = {
            type: 'room/playerMode',
            payload: { roomId: 'room-42', spectate: true }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(mockEmit).toHaveBeenCalledWith('room/playerMode', {
            roomId: 'room-42',
            spectate: true,
        });

        expect(next).toHaveBeenCalledWith(action);
    });

    it('start game', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        const action = {
            type: 'room/startGame',
            payload: { roomId: 'room-42' }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(mockEmit).toHaveBeenCalledWith('room/startGame', {
            roomId: 'room-42',
        });

        expect(next).toHaveBeenCalledWith(action);
    });

    it('start game', () => {
        // 1. Setup
        invoke({ type: 'socket/connect' });

        const action = {
            type: 'game/action',
            payload: { roomId: 'room-42', action: 'soft-drop' }
        };

        // 2. Action
        invoke(action);

        // 3. Assert
        expect(mockEmit).toHaveBeenCalledWith('game/action', {
            roomId: 'room-42',
            action: 'soft-drop',
        });

        expect(next).toHaveBeenCalledWith(action);
    });
});
