import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socketListenning } from './socket.js';
import { rooms, Room } from '../room/room.js';
import { server } from '../index.js';

// Mock server in index.js
vi.mock('../index.js', () => ({
    server: { sendSocketMessage: vi.fn() }
}));

describe('Socket Listening', () => {
    // Record containing all callbacks
    let clientHandlers: Record<string, Record<string, Function>> = {};
    let mockEmit: any;
    let mockToEmit: any;
    let mockTo: any;
    let mockSocket: any;

    beforeEach(() => {
        vi.clearAllMocks();
        rooms.clear(); // Clear room between each test
        clientHandlers = {};
    });

    function createMockClient(socketId: string) {
        const mockEmit = vi.fn();
        const mockToEmit = vi.fn();
        const mockTo = vi.fn().mockReturnValue({ emit: mockToEmit });

        // On initialise le dictionnaire d'événements pour CE joueur
        clientHandlers[socketId] = {};

        const mockSocket = {
            id: socketId,
            join: vi.fn(),
            leave: vi.fn(),
            emit: mockEmit,
            to: mockTo,
            on: vi.fn((eventName: string, callback: Function) => {
                // On range le callback au nom de ce socket précis
                clientHandlers[socketId][eventName] = callback;
            })
        };

        // On branche ce nouveau faux socket à ta fonction principale
        socketListenning(mockSocket as any);

        // On retourne tout ce dont on a besoin pour faire nos 'expect' plus tard
        return { mockSocket, mockEmit, mockTo, mockToEmit };
    }

    it('room/join - create room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payload1 = { roomId: 'room-42', playerName: 'aderouba' };

        // 2. Action
        // Fake message revieced on 'room/join'
        clientHandlers['socket-test-1']['room/join'](payload1);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.adminId).toBe('socket-test-1');

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');

        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client1.mockToEmit).toHaveBeenCalledWith('room/update', expect.any(Object));

        expect(client1.mockEmit).toHaveBeenCalledWith('room/update', expect.objectContaining({
            isAdmin: true,
            yourId: 0
        }));
    });

    it('room/join - multi player', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payload1 = { roomId: 'room-42', playerName: 'aderouba' };

        const client2 = createMockClient('socket-test-2');
        const payload2 = { roomId: 'room-42', playerName: 'lumugot' };

        const client3 = createMockClient('socket-test-3');
        const payload3 = { roomId: 'room-42', playerName: 'vviovi' };

        const client4 = createMockClient('socket-test-4');
        const payload4 = { roomId: 'room-42', playerName: 'tdhaussy' };

        const client5 = createMockClient('socket-test-5');
        const payload5 = { roomId: 'room-42', playerName: 'lflandri' };

        const client6 = createMockClient('socket-test-6');
        const payload6 = { roomId: 'room-42', playerName: 'hde-min' };

        // 2. Action
        // Fake message revieced on 'room/join'
        clientHandlers['socket-test-1']['room/join'](payload1);
        clientHandlers['socket-test-2']['room/join'](payload2);
        clientHandlers['socket-test-3']['room/join'](payload3);
        clientHandlers['socket-test-4']['room/join'](payload4);
        clientHandlers['socket-test-5']['room/join'](payload5);
        clientHandlers['socket-test-6']['room/join'](payload6);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(5);
        expect(room.spectators.length).toBe(1);
        expect(room.adminId).toBe('socket-test-1');

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client2.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client3.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client4.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client5.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client6.mockSocket.join).toHaveBeenCalledWith('room-42');

        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client2.mockTo).toHaveBeenCalledWith('room-42');
        expect(client3.mockTo).toHaveBeenCalledWith('room-42');
        expect(client4.mockTo).toHaveBeenCalledWith('room-42');
        expect(client5.mockTo).toHaveBeenCalledWith('room-42');
        expect(client6.mockTo).toHaveBeenCalledWith('room-42');

        expect(client1.mockToEmit).toHaveBeenCalledWith('room/update', expect.any(Object));
        expect(client1.mockEmit).toHaveBeenCalledWith('room/update', expect.objectContaining({
            isAdmin: true,
            yourId: 0
        }));

        expect(client2.mockToEmit).toHaveBeenCalledWith('room/update', expect.any(Object));
        expect(client2.mockEmit).toHaveBeenCalledWith('room/update', expect.objectContaining({
            isAdmin: false,
            yourId: 1
        }));

        expect(client3.mockToEmit).toHaveBeenCalledWith('room/update', expect.any(Object));
        expect(client3.mockEmit).toHaveBeenCalledWith('room/update', expect.objectContaining({
            isAdmin: false,
            yourId: 2
        }));

        expect(client4.mockToEmit).toHaveBeenCalledWith('room/update', expect.any(Object));
        expect(client4.mockEmit).toHaveBeenCalledWith('room/update', expect.objectContaining({
            isAdmin: false,
            yourId: 3
        }));

        expect(client5.mockToEmit).toHaveBeenCalledWith('room/update', expect.any(Object));
        expect(client5.mockEmit).toHaveBeenCalledWith('room/update', expect.objectContaining({
            isAdmin: false,
            yourId: 4
        }));

        expect(client6.mockToEmit).toHaveBeenCalledWith('room/update', expect.any(Object));
        expect(client6.mockEmit).toHaveBeenCalledWith('room/update', expect.objectContaining({
            isAdmin: false,
            yourId: 5
        }));
    });

    it('room/settings - classic', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        // Fake message revieced on 'room/join'
        const payloadSettings1 = {
            roomId: 'room-42',
            allPieces: true,
            malus: true,
            size: {w: 12, h: 25},
            gameSpeed: {
                speed: 4,
                acceleration: true,
                frequency : 10,
                rate : 2,
                max : 42,
            }
        };
        clientHandlers['socket-test-1']['room/settings'](payloadSettings1);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.allPieces).toBe(true);
        expect(room.malus).toBe(true);
        expect(room.size.w).toBe(12);
        expect(room.size.h).toBe(25);
        expect(room.gameSpeed.speed).toBe(4);
        expect(room.gameSpeed.acceleration).toBe(true);
        expect(room.gameSpeed.frequency).toBe(10);
        expect(room.gameSpeed.rate).toBe(2);
        expect(room.gameSpeed.max).toBe(42);

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client2.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client2.mockTo).toHaveBeenCalledWith('room-42');

        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/update',
            expect.objectContaining({
                allPieces: true,
                malus: true,
                size: {w: 12, h: 25},
                gameSpeed: {
                    speed: 4,
                    acceleration: true,
                    frequency : 10,
                    rate : 2,
                    max : 42,
                }
            })
        );
    });

});
