import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameData } from './gameData.js';
import { Player } from '../room/player.js';
import { PlayerData } from './playerData.js';

import { rooms } from '../room/room.js';
import { server } from '../index.js';

// 1. Mocker index import
vi.mock('../index.js', () => ({
    server: {
        sendSocketMessage: vi.fn()
    }
}));

// Mock room import
vi.mock('../room/room.js', () => {
    return {
        rooms: new Map()
    };
});


describe('startGame', () => {
    // Enable fake timers before each tests
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks(); // Clear all spy
    });

    // Disable fake timers after each tests
    afterEach(() => {
        vi.useRealTimers();
    });

    it('start game basic pieces', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('socket-1', 'aderouba');
        const mockPlayer2 = new Player('socket-2', 'lumugot');

        const gridSize = { w: 10, h: 20 };
        const gameSpeed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // 2. Action
        gameData.startGame('room-1', false, false, gridSize, gameSpeed, [mockPlayer1, mockPlayer2]);

        // 3. Assert
        expect(gameData.solo).toBe(false);
        expect(gameData.isEnd).toBe(false);
        expect(gameData.playerDatas.size).toBe(2);

        // Check piece generation
        expect(gameData.pieces.length).toBeGreaterThan(0);

        // Check tick call
        expect(vi.getTimerCount()).toBe(1);
    });

    it('start game all pieces', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('socket-1', 'aderouba');

        const gridSize = { w: 10, h: 20 };
        const gameSpeed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // 2. Action
        gameData.startGame('room-1', true, false, gridSize, gameSpeed, [mockPlayer1]);

        // 3. Assert
        expect(gameData.solo).toBe(true);
        expect(gameData.isEnd).toBe(false);
        expect(gameData.playerDatas.size).toBe(1);

        // Check piece generation
        expect(gameData.pieces.length).toBeGreaterThan(0);

        // Check tick call
        expect(vi.getTimerCount()).toBe(1);
    });

    it('autoTick no room', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');


        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'id-1',
            type: 'update-grid',
            grid: ['X'],
            nextPiece: 't'
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).not.toHaveBeenCalled();

        // Check message event
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('autoTick update-grid', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: () => mockPlayer1 };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'id-1',
            type: 'update-grid',
            grid: ['X'],
            nextPiece: 't'
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('id-1', 'room/gameUpdate', {
            grid: ['X'],
            nextPiece: 't'
        });
    });

    it('autoTick spectrum', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');
        mockPlayer1.idInRoom = 0;

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: () => mockPlayer1 };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'id-1',
            type: 'spectrum',
            spectrum: {
                heights: [1],
                unbreakableLines: 0
            },
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('room-1', 'room/gameSpectrum', {
            playerId: 0,
            spectrum: {
                heights: [1],
                unbreakableLines: 0
            }
        });
    });

    it('autoTick spectrum bad player', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');
        mockPlayer1.idInRoom = 0;

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: (str: string) => {if (str == 'uwu') return null; return mockPlayer1;} };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'uwu',
            type: 'spectrum',
            spectrum: {
                heights: [1],
                unbreakableLines: 0
            },
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('autoTick next-piece', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: () => mockPlayer1 };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'id-1',
            type: 'next-piece',
            nextPiece: '3',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('id-1', 'room/nextPiece', {
            nextPiece: '3'
        });
    });

    it('autoTick next-piece bad player', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: (str: string) => {if (str == 'uwu') return null; return mockPlayer1;} };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'uwu',
            type: 'next-piece',
            nextPiece: '3',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('autoTick malus', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');
        mockPlayer1.idInRoom = 0;

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: () => mockPlayer1 };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'id-1',
            type: 'malus',
            malusId: 'drunk',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('room-1', 'room/malus', {
            playerId: 0,
            malusId: 'drunk',
        });
    });

    it('autoTick malus bad player', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');
        mockPlayer1.idInRoom = 0;

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: (str: string) => {if (str == 'uwu') return null; return mockPlayer1;} };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'uwu',
            type: 'malus',
            malusId: 'drunk',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('autoTick end', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: () => mockPlayer1 };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: 'id-1',
            type: 'end',
            win: false,
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('id-1', 'room/gameEnd', {
            win: false,
        });
    });

    it('autoTick finished', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: () => mockPlayer1 };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: '',
            type: 'finished',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('room-1', 'room/gameFinished', {});
    });

    it('autoTick uwu', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = { id: 'room-1', isPlaying: true, gamedata: gameData, getPlayerById: () => mockPlayer1 };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: false, frequency: 60, rate: 1, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: '',
            type: 'uwu',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).not.toHaveBeenCalled();
    });

    it('autoTick acceleration tick', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = {
            id: 'room-1',
            isPlaying: true,
            gamedata: gameData,
            getPlayerById: () => mockPlayer1,
            gameSpeed: { speed: 2, acceleration: true, frequency: 10, rate: 3, max: 10 }
        };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: true, frequency: 10, rate: 3, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: '',
            type: 'finished',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('room-1', 'room/gameFinished', {});
    });

    it('autoTick acceleration bellow max', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = {
            id: 'room-1',
            isPlaying: true,
            gamedata: gameData,
            getPlayerById: () => mockPlayer1,
            gameSpeed: { speed: 2, acceleration: true, frequency: 0, rate: 3, max: 10 }
        };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 2, acceleration: true, frequency: 0, rate: 3, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: '',
            type: 'finished',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('room-1', 'room/gameFinished', {});
    });

    it('autoTick acceleration max', () => {
        // 1. Setup
        const gameData = new GameData();
        const mockPlayer1 = new Player('id-1', 'aderouba');

        // Create room
        const mockRoom = {
            id: 'room-1',
            isPlaying: true,
            gamedata: gameData,
            getPlayerById: () => mockPlayer1,
            gameSpeed: { speed: 2, acceleration: true, frequency: 0, rate: 3, max: 10 }
        };
        // Add it to rooms
        rooms.set('room-1', mockRoom as any);

        const speed = { speed: 9, acceleration: true, frequency: 0, rate: 3, max: 10 };

        // Mock tick method
        const tickSpy = vi.spyOn(gameData, 'tick').mockReturnValue([{
            id: '',
            type: 'finished',
        }]);

        // 2. Action
        gameData.startGame('room-1', false, false, {w: 10, h: 20}, speed, [mockPlayer1]);

        // At start, it must not be call
        expect(tickSpy).not.toHaveBeenCalled();

        // Step 500ms
        vi.advanceTimersByTime(500);

        // 3. Assert
        expect(tickSpy).toHaveBeenCalledTimes(1);

        // Check message event
        expect(server.sendSocketMessage).toHaveBeenCalledWith('room-1', 'room/gameFinished', {});
    });
});


describe('removePlayer', () => {
    it('solo', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.removePlayer('id-1');

        // 3. Assert
        expect(gameData.solo).toBe(true);
        expect(gameData.isEnd).toBe(false);
        expect(gameData.playerDatas.size).toBe(1);
        expect(events.length).toBe(0);
    });

    it('not in game', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.solo = false;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.removePlayer('uwu');

        // 3. Assert
        expect(gameData.solo).toBe(false);
        expect(gameData.isEnd).toBe(false);
        expect(gameData.playerDatas.size).toBe(2);
        expect(events.length).toBe(0);
    });

    it('make win', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.solo = false;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.removePlayer('id-2');

        // 3. Assert
        expect(gameData.solo).toBe(false);
        expect(gameData.isEnd).toBe(true);
        expect(gameData.playerDatas.size).toBe(1);
        expect(events.length).toBe(2);
    });

    it('make not win', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.solo = false;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
            new Player('uwu', 'uwu'),
            new Player('42', '42'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }
        gameData.playerDatas.get('42')!.alive = false;

        // 2. Action
        const events = gameData.removePlayer('uwu');

        // 3. Assert
        expect(gameData.solo).toBe(false);
        expect(gameData.isEnd).toBe(false);
        expect(gameData.playerDatas.size).toBe(3);
        expect(events.length).toBe(0);
    });
});


describe('playerAction', () => {
    it('no it game', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.playerAction('uwu', ' ');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });

    it('left', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.playerAction('id-1', 'left');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });

    it('right', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.playerAction('id-1', 'right');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });

    it('rotate', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.playerAction('id-1', 'rotate');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });

    it('soft drop no fix', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            gameData.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }

        // 2. Action
        const events = gameData.playerAction('id-1', 'soft-drop');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });

    it('soft drop fix', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            playerData.piece.y = 18;
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.playerAction('id-1', 'soft-drop');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(2);
    });

    it('hard drop', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.playerAction('id-1', 'hard-drop');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(2);
    });

    it('bad action', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.playerAction('id-1', 'uwu');

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });
});


describe('tick', () => {
    it('game end', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.isEnd = true;
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.tick();

        // 3. Assert
        expect(gameData.isEnd).toBe(true);
        expect(events.length).toBe(0);
    });

    it('player not alive', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            playerData.alive = false;
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.tick();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });

    it('player tick', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.tick();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(0);
    });

    it('player tick fix', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            playerData.piece.y = 18;
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.tick();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(2);
    });

    it('player tick fix loose end game solo', () => {
        // 1. Setup
        const gameData = new GameData();
        const players = [new Player('id-1', 'aderouba')];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            playerData.piece.x = -1;
            gameData.playerDatas.set(player.id, playerData);
        }

        // 2. Action
        const events = gameData.tick();

        // 3. Assert
        expect(gameData.isEnd).toBe(true);
        expect(events.length).toBe(2);
    });

    it('player tick fix loose end game multi', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.solo = false;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }
        gameData.playerDatas.get('id-1')!.piece.x = -1;

        // 2. Action
        const events = gameData.tick();

        // 3. Assert
        expect(gameData.isEnd).toBe(true);
        expect(events.length).toBe(3);
    });

    it('player tick fix loose not end game', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.solo = false;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
            new Player('uwu', 'uwu'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';
        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }
        gameData.playerDatas.get('id-1')!.piece.x = -1;

        // 2. Action
        const events = gameData.tick();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(1);
    });

    it('player tick fix clear 1 unbreakable line no malus proc', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.malus = true;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';

        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        const playerData = gameData.playerDatas.get('id-1');
        playerData!.piece.y = 18;

        vi.spyOn(playerData!.grid, 'clearLines').mockImplementation(()=>{return 2});
        const randomSpy = vi.spyOn(Math, 'random');
        randomSpy.mockReturnValueOnce(0.9);

        // 2. Action
        const events = gameData.tick();

        randomSpy.mockRestore();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(4);
    });

    it('player tick fix clear no unbreakable line malus proc 1', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.malus = true;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';

        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        const playerData = gameData.playerDatas.get('id-1');
        playerData!.piece.y = 18;

        vi.spyOn(playerData!.grid, 'clearLines').mockImplementation(()=>{return 1});
        const randomSpy = vi.spyOn(Math, 'random');
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);

        const playerData2 = gameData.playerDatas.get('id-2');
        vi.spyOn(playerData2!, 'applyMalus').mockImplementation(()=>{return 'fix-piece'});

        // 2. Action
        const events = gameData.tick();

        randomSpy.mockRestore();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(5);
    });

    it('player tick fix clear no unbreakable line malus proc 2', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.malus = true;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';

        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        const playerData = gameData.playerDatas.get('id-1');
        playerData!.piece.y = 18;

        vi.spyOn(playerData!.grid, 'clearLines').mockImplementation(()=>{return 1});
        const randomSpy = vi.spyOn(Math, 'random');
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);

        const playerData2 = gameData.playerDatas.get('id-2');
        vi.spyOn(playerData2!, 'applyMalus').mockImplementation(()=>{return 'next-piece'});

        // 2. Action
        const events = gameData.tick();

        randomSpy.mockRestore();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(4);
    });

    it('player tick fix clear no unbreakable line malus proc 3', () => {
        // 1. Setup
        const gameData = new GameData();
        gameData.malus = true;
        const players = [
            new Player('id-1', 'aderouba'),
            new Player('id-2', 'lumugot'),
        ];

        const gridSize = {w: 10, h: 20};
        const pieceId = 's';
        const nextPieceId = 't';

        for (const player of players) {
            const playerData = new PlayerData(player.id, gridSize, pieceId, nextPieceId);
            gameData.playerDatas.set(player.id, playerData);
        }

        const playerData = gameData.playerDatas.get('id-1');
        playerData!.piece.y = 18;

        vi.spyOn(playerData!.grid, 'clearLines').mockImplementation(()=>{return 1});
        const randomSpy = vi.spyOn(Math, 'random');
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);

        const playerData2 = gameData.playerDatas.get('id-2');
        vi.spyOn(playerData2!, 'applyMalus').mockImplementation(()=>{return 'none'});

        // 2. Action
        const events = gameData.tick();

        randomSpy.mockRestore();

        // 3. Assert
        expect(gameData.isEnd).toBe(false);
        expect(events.length).toBe(3);
    });
});
