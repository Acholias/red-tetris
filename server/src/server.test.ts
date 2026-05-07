import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from './server.js';

// ------------------------------------------------------------------
// GLOBAL MOCK
// ------------------------------------------------------------------

// Block express and http
vi.mock('express', () => ({
    default: () => ({ use: vi.fn() })
}));
vi.mock('node:http', () => ({
    createServer: vi.fn()
}));

// Block import
vi.mock('./socket/socket.js', () => ({
    socketListenning: vi.fn()
}));

// Mock chain to().emit()
const mockEmit = vi.fn();
// Emulate Socket.io beavior
const mockTo = vi.fn().mockReturnValue({ emit: mockEmit });

vi.mock('socket.io', () => ({
    Server: class {
        // on() is call in constructor by setSocket()
        on = vi.fn();
        to = mockTo;
    }
}));

// ------------------------------------------------------------------
// TESTS
// ------------------------------------------------------------------

describe('Server Class', () => {

    // Reset all mock
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sendSocketMessage doit chainer io.to() et emit() avec les bons paramètres', () => {
        // 1. Setup
        const server = new Server(4242);
        const target = 'room-42';
        const route = 'gameUpdate';
        const payload = { grid: ['E', 'E'], nextPiece: 't' };

        // 2. Action
        server.sendSocketMessage(target, route, payload);

        // 3. Assert
        // Check call `.to()` with good target
        expect(mockTo).toHaveBeenCalledOnce();
        expect(mockTo).toHaveBeenCalledWith(target);

        // Check call `.emit()` with good route and payload
        expect(mockEmit).toHaveBeenCalledOnce();
        expect(mockEmit).toHaveBeenCalledWith(route, payload);
    });
});
