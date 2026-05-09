import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socketMiddleware } from './socketMiddleware';

// Mock socket.io
const mockEmit = vi.fn();
const mockOn = vi.fn();

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

    it('join room', () => {
        // 1. Setup :
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
});
