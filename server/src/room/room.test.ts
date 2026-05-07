import { describe, it, expect, vi } from 'vitest';
import { Room } from './room.js';
import { Player } from './player.js';


describe('addPlayer', () => {
    it('no game', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);

        // 2. Action
        const result = room.isAdmin(admin);

        // 3. Assert
        expect(result).toBe(true);
    });
});


describe('addPlayer', () => {
    it('no game', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);

        const newPlayer = new Player('player-2', 'lumugot');

        // 2. Action
        room.addPlayer(newPlayer);

        // 3. Assert
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.isPlayerSpectate('player-2')).toBe(false);
    });

    it('no game, too many player', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);
        room.players.push(admin);
        room.players.push(admin);
        room.players.push(admin);
        room.players.push(admin);

        const newPlayer = new Player('player-2', 'lumugot');

        // 2. Action
        room.addPlayer(newPlayer);

        // 3. Assert
        expect(room.players.length).toBe(5);
        expect(room.spectators.length).toBe(1);
        expect(room.isPlayerSpectate('player-2')).toBe(true);
    });

    it('in game', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);
        room.isPlaying = true;

        const newPlayer = new Player('player-2', 'lumugot');

        // 2. Action
        room.addPlayer(newPlayer);

        // 3. Assert
        expect(room.players.length).toBe(1);
        expect(room.spectators.length).toBe(1);
        expect(room.isPlayerSpectate('player-2')).toBe(true);
    });

    it('already in room', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);

        const newPlayer = new Player('player-2', 'lumugot');
        room.players.push(newPlayer);

        // 2. Action
        room.addPlayer(newPlayer);

        // 3. Assert
        expect(room.players.length).toBe(2);
        expect(room.spectators.length).toBe(0);
        expect(room.isPlayerSpectate('player-2')).toBe(false);
    });
});


describe('getPlayerById', () => {
    it('in players', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);

        // 2. Action
        const result = room.getPlayerById('admin-id');

        // 3. Assert
        expect(result).toEqual(admin);
    });

    it('in spectators', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);

        const spectator = new Player('player-2', 'lumugot');
        room.spectators.push(spectator);

        // 2. Action
        const result = room.getPlayerById('player-2');

        // 3. Assert
        expect(result).toEqual(spectator);
    });

    it('not in room', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);

        const spectator = new Player('player-2', 'lumugot');
        room.spectators.push(spectator);

        // 2. Action
        const result = room.getPlayerById('uwu');

        // 3. Assert
        expect(result).toEqual(null);
        expect(room.isPlayerSpectate('uwu')).toEqual(false);
    });
});


describe('startGame', () => {
    it('start game', () => {
        // 1. Setup
        const admin = new Player('admin-id', 'aderouba');
        const room = new Room('room-1', admin);

        const startGameSpy = vi.spyOn(room.gamedata, 'startGame').mockImplementation(()=>{});

        // 2. Action
        room.startGame();

        // 3. Assert
        expect(startGameSpy).toHaveBeenCalledOnce();
    });
});

