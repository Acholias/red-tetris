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

    // -----------------------------------------------------------------------
    // room/join
    // -----------------------------------------------------------------------

    it('room/join - create room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payload1 = { roomId: 'room-42', playerName: 'aderouba' };

        // 2. Action
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

    // -----------------------------------------------------------------------
    // room/settings
    // -----------------------------------------------------------------------

    it('room/settings - classic', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
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

    it('room/settings - bad room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        // 2. Action
        const payloadSettings1 = {
            roomId: 'room-uwu',
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
        expect(room.players.length).toBe(1);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('room/settings - bad client', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');

        // 2. Action
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
        clientHandlers['socket-test-2']['room/settings'](payloadSettings1);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.adminId).toBe('socket-test-1');

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client2.mockSocket.join).not.toHaveBeenCalled();
        expect(client2.mockTo).not.toHaveBeenCalled();

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).not.toHaveBeenCalled();
    });

    it('room/settings - not admin', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
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
        clientHandlers['socket-test-2']['room/settings'](payloadSettings1);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.adminId).toBe('socket-test-1');

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client2.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client2.mockTo).toHaveBeenCalledWith('room-42');
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
        const payloadSettings1 = {
            roomId: 'room-42',
            allPieces: true,
        };
        clientHandlers['socket-test-1']['room/settings'](payloadSettings1);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.allPieces).toBe(true);

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client2.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client2.mockTo).toHaveBeenCalledWith('room-42');

        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/update',
            expect.objectContaining({
                allPieces: true,
            })
        );
    });

    it('room/settings - too low', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        const payloadSettings1 = {
            roomId: 'room-42',
            size: {w: 1, h: 1},
            gameSpeed: {
                speed: 0,
                acceleration: true,
                frequency : 0,
                rate : 0,
                max : 0,
            }
        };
        clientHandlers['socket-test-1']['room/settings'](payloadSettings1);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.size.w).toBe(5);
        expect(room.size.h).toBe(10);
        expect(room.gameSpeed.speed).toBe(1);
        expect(room.gameSpeed.acceleration).toBe(true);
        expect(room.gameSpeed.frequency).toBe(1);
        expect(room.gameSpeed.rate).toBe(1);
        expect(room.gameSpeed.max).toBe(1);

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client2.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client2.mockTo).toHaveBeenCalledWith('room-42');

        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/update',
            expect.objectContaining({
                size: {w: 5, h: 10},
                gameSpeed: {
                    speed: 1,
                    acceleration: true,
                    frequency : 1,
                    rate : 1,
                    max : 1,
                }
            })
        );
    });

    it('room/settings - too high', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        const payloadSettings1 = {
            roomId: 'room-42',
            size: {w: 100, h: 100},
            gameSpeed: {
                speed: 1000,
                acceleration: true,
                frequency : 1000,
                rate : 1000,
                max : 1000,
            }
        };
        clientHandlers['socket-test-1']['room/settings'](payloadSettings1);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.size.w).toBe(20);
        expect(room.size.h).toBe(30);
        expect(room.gameSpeed.speed).toBe(100);
        expect(room.gameSpeed.acceleration).toBe(true);
        expect(room.gameSpeed.frequency).toBe(200);
        expect(room.gameSpeed.rate).toBe(10);
        expect(room.gameSpeed.max).toBe(100);

        expect(client1.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client1.mockTo).toHaveBeenCalledWith('room-42');
        expect(client2.mockSocket.join).toHaveBeenCalledWith('room-42');
        expect(client2.mockTo).toHaveBeenCalledWith('room-42');

        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/update',
            expect.objectContaining({
                size: {w: 20, h: 30},
                gameSpeed: {
                    speed: 100,
                    acceleration: true,
                    frequency : 200,
                    rate : 10,
                    max : 100,
                }
            })
        );
    });

    // -----------------------------------------------------------------------
    // room/playerMode
    // -----------------------------------------------------------------------

    it('room/playerMode - bad room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        const payloadTest = {
            roomId: 'room-uwu',
            spectate: true,
        };
        clientHandlers['socket-test-1']['room/playerMode'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('room/playerMode - bad player', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            spectate: true,
        };
        clientHandlers['socket-test-2']['room/playerMode'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).not.toHaveBeenCalled();
    });

    it('room/playerMode - spectate valid', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            spectate: true,
        };
        clientHandlers['socket-test-1']['room/playerMode'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(1);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/update',
            expect.objectContaining({
                players: [{id: 1, name: 'lumugot'}],
                spectators: [{id: 0, name: 'aderouba'}],
            })
        );
    });

    it('room/playerMode - spectate invalid', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);
        const payloadSpectate1 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-1']['room/playerMode'](payloadSpectate1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);
        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            spectate: true,
        };
        clientHandlers['socket-test-1']['room/playerMode'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(1);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).toHaveBeenCalledTimes(1);
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('room/playerMode - play valid', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);
        const payloadSpectate1 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-1']['room/playerMode'](payloadSpectate1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);
        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            spectate: false,
        };
        clientHandlers['socket-test-1']['room/playerMode'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/update',
            expect.objectContaining({
                players: [{id: 1, name: 'lumugot'}, {id: 0, name: 'aderouba'}],
                spectators: [],
            })
        );
    });

    it('room/playerMode - play too much play', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);
        const payloadSpectate1 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-1']['room/playerMode'](payloadSpectate1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        const client3 = createMockClient('socket-test-3');
        const payloadJoin3 = { roomId: 'room-42', playerName: 'viovi' };
        clientHandlers['socket-test-3']['room/join'](payloadJoin3);

        const client4 = createMockClient('socket-test-4');
        const payloadJoin4 = { roomId: 'room-42', playerName: 'tdhaussy' };
        clientHandlers['socket-test-4']['room/join'](payloadJoin4);

        const client5 = createMockClient('socket-test-5');
        const payloadJoin5 = { roomId: 'room-42', playerName: 'lflandri' };
        clientHandlers['socket-test-5']['room/join'](payloadJoin5);

        const client6 = createMockClient('socket-test-6');
        const payloadJoin6 = { roomId: 'room-42', playerName: 'hde-min' };
        clientHandlers['socket-test-6']['room/join'](payloadJoin6);

        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            spectate: false,
        };
        clientHandlers['socket-test-1']['room/playerMode'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(5);
        expect(room.spectators.length).toBe(1);
        expect(room.isPlayerSpectate('socket-test-1')).toBe(true);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockEmit).not.toHaveBeenCalled();
        expect(client3.mockEmit).not.toHaveBeenCalled();
        expect(client4.mockEmit).not.toHaveBeenCalled();
        expect(client5.mockEmit).not.toHaveBeenCalled();
        expect(client6.mockEmit).not.toHaveBeenCalled();
    });

    it('room/playerMode - play invalid', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);
        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            spectate: false,
        };
        clientHandlers['socket-test-1']['room/playerMode'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    // -----------------------------------------------------------------------
    // room/startGame
    // -----------------------------------------------------------------------

    it('room/startGame - bad room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        const payloadTest = {
            roomId: 'room-uwu',
        };
        clientHandlers['socket-test-1']['room/startGame'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(false);

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('room/startGame - already playing', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-1']['room/startGame'](payloadTest);

        // 3. Assert
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(true);

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('room/startGame - bad player', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-2']['room/startGame'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(false);

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).not.toHaveBeenCalled();
    });

    it('room/startGame - is not admin', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-2']['room/startGame'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);

        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('room/startGame - started', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        vi.spyOn(room, 'startGame').mockImplementation(() => {
            room.gamedata.pieces = ['O', 't'];
        });

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-1']['room/startGame'](payloadTest);

        // 3. Assert
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(true);

        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/gameStarted',
            expect.objectContaining({
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
                pieceId: 'O',
                nextPieceId: 't',
            })
        );
    });

    // -----------------------------------------------------------------------
    // game/action
    // -----------------------------------------------------------------------

    it('game/action - bad room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        // 2. Action
        const payloadTest = {
            roomId: 'room-uwu',
        };
        clientHandlers['socket-test-1']['game/action'](payloadTest);

        // 3. Assert
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('game/action - is not playing', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);


        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-1']['game/action'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).toHaveBeenCalledTimes(1);
    });

    it('game/action - bad player', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-2']['game/action'](payloadTest);

        // 3. Assert
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).toHaveBeenCalledTimes(1);
        expect(client2.mockEmit).not.toHaveBeenCalled();
    });

    it('game/action - event update-grid', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.spyOn(room.gamedata, 'playerAction').mockImplementation(() => {
            return [
                {
                    type: 'update-grid',
                    id: 'socket-test-2',
                    grid: ['X'],
                    nextPiece: 's'
                },
                {
                    type: 'update-grid',
                    id: 'socket-test-1',
                    grid: ['X'],
                }
            ];
        });
        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-2']['game/action'](payloadTest);

        // 3. Assert
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(true);

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockTo).toHaveBeenCalledWith('socket-test-1');
        expect(client2.mockEmit).toHaveBeenCalledWith('room/gameUpdate', expect.objectContaining({
            grid: ['X'],
            nextPiece: 's'
        }));
    });

    it('game/action - event spectrum', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.spyOn(room.gamedata, 'playerAction').mockImplementation(() => {
            return [
                {
                    type: 'spectrum',
                    id: 'socket-test-2',
                    spectrum: {
                        heights: [0, 1, 2],
                        unbreakableLines: 1
                    }
                },
                {
                    type: 'spectrum',
                    id: 'uwu',
                    spectrum: {
                        heights: [0, 1, 2],
                        unbreakableLines: 1
                    }
                }
            ];
        });
        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-2']['game/action'](payloadTest);

        // 3. Assert
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(true);

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockEmit).not.toHaveBeenCalled();
        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/gameSpectrum',
            expect.objectContaining({
                playerId: 1,
                spectrum: {
                    heights: [0, 1, 2],
                    unbreakableLines: 1
                }
            }
        ));
    });

    it('game/action - event next-piece', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.spyOn(room.gamedata, 'playerAction').mockImplementation(() => {
            return [
                {
                    type: 'next-piece',
                    id: 'socket-test-2',
                    nextPiece: 's'
                },
                {
                    type: 'next-piece',
                    id: 'socket-test-1',
                    nextPiece: 't'
                },
                {
                    type: 'next-piece',
                    id: 'uwu',
                    nextPiece: 't'
                }
            ];
        });
        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-2']['game/action'](payloadTest);

        // 3. Assert
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(true);

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockTo).toHaveBeenCalledWith('socket-test-1');
        expect(client2.mockEmit).toHaveBeenCalledWith('room/nextPiece', expect.objectContaining({
            nextPiece: 's'
        }));
    });

    it('game/action - event malus', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.spyOn(room.gamedata, 'playerAction').mockImplementation(() => {
            return [
                {
                    type: 'malus',
                    id: 'socket-test-2',
                    malusId: 'drunk'
                },
                {
                    type: 'malus',
                    id: 'uwu',
                    malusId: 'drunk'
                }
            ];
        });
        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-2']['game/action'](payloadTest);

        // 3. Assert
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(true);

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockEmit).not.toHaveBeenCalled();
        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/malus',
            expect.objectContaining({
                playerId: 1,
                malusId: 'drunk'
            }
        ));
    });

    it('game/action - event end', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.spyOn(room.gamedata, 'playerAction').mockImplementation(() => {
            return [
                {
                    type: 'end',
                    id: 'socket-test-2',
                    win: true
                },
                {
                    type: 'end',
                    id: 'socket-test-1',
                    win: false
                }
            ];
        });
        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-2']['game/action'](payloadTest);

        // 3. Assert
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(true);

        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockTo).toHaveBeenCalledWith('socket-test-1');
        expect(client2.mockEmit).toHaveBeenCalledWith('room/gameEnd', expect.objectContaining({
            win: true
        }));
    });

    it('game/action - event finished', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.spyOn(room.gamedata, 'playerAction').mockImplementation(() => {
            return [
                {
                    type: 'finished',
                    id: 'socket-test-2',
                },
                {
                    type: 'uwu',
                    id: 'socket-test-2',
                }
            ];
        });
        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
            action: 'soft-drop',
        };
        clientHandlers['socket-test-2']['game/action'](payloadTest);

        // 3. Assert
        expect(room.adminId).toBe('socket-test-1');
        expect(room.isPlaying).toBe(false);

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockEmit).not.toHaveBeenCalled();
        expect(server.sendSocketMessage).toHaveBeenCalled();
    });

    // -----------------------------------------------------------------------
    // room/leave
    // -----------------------------------------------------------------------

    it('room/leave - bad room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-uwu',
        };
        clientHandlers['socket-test-1']['room/leave'](payloadTest);

        // 3. Assert
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockEmit).not.toHaveBeenCalled();
    });

    it('room/leave - bad player', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-2']['room/leave'](payloadTest);

        // 3. Assert
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockEmit).not.toHaveBeenCalled();
    });

    it('room/leave - not last player, in game', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.clearAllMocks();
        vi.spyOn(room.gamedata, 'removePlayer').mockImplementation(() => {
            return [
                {
                    type: 'end',
                    id: 'socket-test-1',
                    win: true
                },
                {
                    type: 'finished',
                    id: '',
                }
            ];
        });

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-2']['room/leave'](payloadTest);

        // 3. Assert
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(0);
        expect(room.isPlaying).toBe(false);

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockTo).toHaveBeenCalledWith('socket-test-1');
        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/gameFinished',
            expect.objectContaining({}
        ));
    });

    it('room/leave - last player', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-1']['room/leave'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(false);

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('room/leave - not last player, giving change admin in players', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);
        const payloadSpectate1 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-1']['room/playerMode'](payloadSpectate1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        const client3 = createMockClient('socket-test-3');
        const payloadJoin3 = { roomId: 'room-42', playerName: 'vviovi' };
        clientHandlers['socket-test-3']['room/join'](payloadJoin3);
        const payloadSpectate3 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-3']['room/playerMode'](payloadSpectate3);

        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-1']['room/leave'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(1);
        expect(room.isPlaying).toBe(false);
        expect(room.adminId).toBe('socket-test-2');

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client1.mockTo).toHaveBeenCalledWith('socket-test-2');
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('room/leave - not last player, giving change admin in spectators', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);
        const payloadSpectate1 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-1']['room/playerMode'](payloadSpectate1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);
        const payloadSpectate2 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-2']['room/playerMode'](payloadSpectate2);

        vi.clearAllMocks();

        // 2. Action
        const payloadTest = {
            roomId: 'room-42',
        };
        clientHandlers['socket-test-1']['room/leave'](payloadTest);

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(0);
        expect(room.spectators.length).toBe(1);
        expect(room.isPlaying).toBe(false);
        expect(room.adminId).toBe('socket-test-2');

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client1.mockTo).toHaveBeenCalledWith('socket-test-2');
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    // -----------------------------------------------------------------------
    // disconnect
    // -----------------------------------------------------------------------

    it('disconnect - no room', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        // 2. Action
        clientHandlers['socket-test-1']['disconnect']();

        // 3. Assert
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
        expect(client1.mockEmit).not.toHaveBeenCalled();
    });

    it('disconnect - not last player, in game', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        room.isPlaying = true;

        vi.clearAllMocks();
        vi.spyOn(room.gamedata, 'removePlayer').mockImplementation(() => {
            return [
                {
                    type: 'end',
                    id: 'socket-test-1',
                    win: true
                },
                {
                    type: 'finished',
                    id: '',
                }
            ];
        });

        // 2. Action
        clientHandlers['socket-test-2']['disconnect']();

        // 3. Assert
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(0);
        expect(room.isPlaying).toBe(false);

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client2.mockTo).toHaveBeenCalledWith('socket-test-1');
        expect(server.sendSocketMessage).toHaveBeenCalledWith(
            'room-42',
            'room/gameFinished',
            expect.objectContaining({}
        ));
    });

    it('disconnect - last player', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);

        vi.clearAllMocks();

        // 2. Action
        clientHandlers['socket-test-1']['disconnect']();

        // 3. Assert
        expect(rooms.has('room-42')).toBe(false);

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('disconnect - not last player, giving change admin in players', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);
        const payloadSpectate1 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-1']['room/playerMode'](payloadSpectate1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);

        const client3 = createMockClient('socket-test-3');
        const payloadJoin3 = { roomId: 'room-42', playerName: 'vviovi' };
        clientHandlers['socket-test-3']['room/join'](payloadJoin3);
        const payloadSpectate3 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-3']['room/playerMode'](payloadSpectate3);

        vi.clearAllMocks();

        // 2. Action
        clientHandlers['socket-test-1']['disconnect']();

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(1);
        expect(room.isPlaying).toBe(false);
        expect(room.adminId).toBe('socket-test-2');

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client1.mockTo).toHaveBeenCalledWith('socket-test-2');
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('disconnect - not last player, giving change admin in spectators', () => {
        // 1. Setup
        const client1 = createMockClient('socket-test-1');
        const payloadJoin1 = { roomId: 'room-42', playerName: 'aderouba' };
        clientHandlers['socket-test-1']['room/join'](payloadJoin1);
        const payloadSpectate1 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-1']['room/playerMode'](payloadSpectate1);

        const client2 = createMockClient('socket-test-2');
        const payloadJoin2 = { roomId: 'room-42', playerName: 'lumugot' };
        clientHandlers['socket-test-2']['room/join'](payloadJoin2);
        const payloadSpectate2 = { roomId: 'room-42', spectate: true };
        clientHandlers['socket-test-2']['room/playerMode'](payloadSpectate2);

        vi.clearAllMocks();

        // 2. Action
        clientHandlers['socket-test-1']['disconnect']();

        // 3. Assert
        expect(rooms.has('room-42')).toBe(true);
        const room = rooms.get('room-42')!;
        expect(room.players.length).toBe(0);
        expect(room.spectators.length).toBe(1);
        expect(room.isPlaying).toBe(false);
        expect(room.adminId).toBe('socket-test-2');

        expect(client1.mockEmit).not.toHaveBeenCalled();
        expect(client1.mockTo).toHaveBeenCalledWith('socket-test-2');
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });
});
