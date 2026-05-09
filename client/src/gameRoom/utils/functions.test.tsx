import { describe, it, expect } from 'vitest';
import type { Room } from '../data/room';
import { canYouPlay, canYouSpectate } from './functions';


describe('canYouPlay', () => {
    it('too much player', () => {
        // 1. Setup
        const room: Room = {
            id: 'uwu',
            isSocketConnected: false,
            isAdmin: false,
            isPlaying: false,
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 1,
                acceleration: false,
                frequency: 1,
                rate: 1,
                max: 10
            },
            players: [
                {id: 0, name: 'aderouba'},
                {id: 1, name: 'lumugot'},
                {id: 2, name: 'vviovi'},
                {id: 4, name: 'tdhaussy'},
                {id: 5, name: 'lflandri'},
            ],
            spectators: [],
            yourId: 0,
        };

        // 2. Action
        const result = canYouPlay(room);

        // 3. Assert
        expect(result).toBe(false);
    });

    it('already play', () => {
        // 1. Setup
        const room: Room = {
            id: 'uwu',
            isSocketConnected: false,
            isAdmin: false,
            isPlaying: false,
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 1,
                acceleration: false,
                frequency: 1,
                rate: 1,
                max: 10
            },
            players: [
                {id: 0, name: 'aderouba'},
                {id: 1, name: 'lumugot'},
                {id: 2, name: 'vviovi'},
                {id: 4, name: 'tdhaussy'},
            ],
            spectators: [],
            yourId: 0,
        };

        // 2. Action
        const result = canYouPlay(room);

        // 3. Assert
        expect(result).toBe(false);
    });

    it('no in player', () => {
        // 1. Setup
        const room: Room = {
            id: 'uwu',
            isSocketConnected: false,
            isAdmin: false,
            isPlaying: false,
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 1,
                acceleration: false,
                frequency: 1,
                rate: 1,
                max: 10
            },
            players: [
                {id: 0, name: 'aderouba'},
            ],
            spectators: [],
            yourId: 1,
        };

        // 2. Action
        const result = canYouPlay(room);

        // 3. Assert
        expect(result).toBe(true);
    });
});


describe('canYouSpectate', () => {
    it('already spectate', () => {
        // 1. Setup
        const room: Room = {
            id: 'uwu',
            isSocketConnected: false,
            isAdmin: false,
            isPlaying: false,
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 1,
                acceleration: false,
                frequency: 1,
                rate: 1,
                max: 10
            },
            players: [],
            spectators: [
                {id: 0, name: 'aderouba'},
            ],
            yourId: 0,
        };

        // 2. Action
        const result = canYouSpectate(room);

        // 3. Assert
        expect(result).toBe(false);
    });

    it('no in spectator', () => {
        // 1. Setup
        const room: Room = {
            id: 'uwu',
            isSocketConnected: false,
            isAdmin: false,
            isPlaying: false,
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 1,
                acceleration: false,
                frequency: 1,
                rate: 1,
                max: 10
            },
            players: [],
            spectators: [
                {id: 0, name: 'aderouba'},
            ],
            yourId: 1,
        };

        // 2. Action
        const result = canYouSpectate(room);

        // 3. Assert
        expect(result).toBe(true);
    });
});
