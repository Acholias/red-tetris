import { describe, it, expect } from 'vitest';
import roomReducer, { initRoom, setSocketConnected, updateRoom } from './roomSlice';
import type { Room } from '../data/room';
import type { BodyRoomUpdate } from '@shared/requestBody';

describe('setSocketConnected', () => {
    it('setSocketConnected', () => {
        // 1. Setup
        const initialState = { isSocketConnected: false } as Room;

        // 2. Action
        const action = setSocketConnected(true);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.isSocketConnected).toBe(true);
    });
});


describe('initRoom', () => {
    it('initRoom', () => {
        // 1. Setup
        const initialState = { isSocketConnected: false } as Room;
        const param = {
            id: 'room-42',
            playerName: 'aderouba',
        };

        // 2. Action
        const action = initRoom(param);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.id).toBe('room-42');
        expect(newState.isPlaying).toBe(false);
        expect(newState.isAdmin).toBe(false);
        expect(newState.allPieces).toBe(false);
        expect(newState.malus).toBe(false);
        expect(newState.size.w).toBe(10);
        expect(newState.size.h).toBe(20);
        expect(newState.gameSpeed.speed).toBe(2);
        expect(newState.gameSpeed.acceleration).toBe(false);
        expect(newState.gameSpeed.frequency).toBe(60);
        expect(newState.gameSpeed.rate).toBe(1);
        expect(newState.gameSpeed.max).toBe(10);
        expect(newState.players).toStrictEqual([
            { id: 0, name: 'aderouba' }
        ]);
        expect(newState.spectators).toStrictEqual([]);
    });
});


describe('updateRoom', () => {
    it('empty payload', () => {
        // 1. Setup
        const initialState = {
            id: 'room-42',
            isSocketConnected: true,
            isAdmin: false,
            isPlaying: false,
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 2,
                acceleration: false,
                frequency: 60,
                rate: 1,
                max: 10,
            },
            players: [
                {id: 0, name: 'aderouba'}
            ],
            spectators: [],
            yourId: 0,
        } as Room;
        const param: BodyRoomUpdate = {};

        // 2. Action
        const action = updateRoom(param);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.id).toBe('room-42');
        expect(newState.isPlaying).toBe(false);
        expect(newState.isAdmin).toBe(false);
        expect(newState.allPieces).toBe(false);
        expect(newState.malus).toBe(false);
        expect(newState.size.w).toBe(10);
        expect(newState.size.h).toBe(20);
        expect(newState.gameSpeed.speed).toBe(2);
        expect(newState.gameSpeed.acceleration).toBe(false);
        expect(newState.gameSpeed.frequency).toBe(60);
        expect(newState.gameSpeed.rate).toBe(1);
        expect(newState.gameSpeed.max).toBe(10);
        expect(newState.players).toStrictEqual([
            { id: 0, name: 'aderouba' }
        ]);
        expect(newState.spectators).toStrictEqual([]);
        expect(newState.yourId).toBe(0);
    });

    it('filled payload', () => {
        // 1. Setup
        const initialState = {
            id: 'room-42',
            isSocketConnected: true,
            isAdmin: false,
            isPlaying: false,
            allPieces: false,
            malus: false,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 2,
                acceleration: false,
                frequency: 60,
                rate: 1,
                max: 10,
            },
            players: [
                {id: 0, name: 'aderouba'}
            ],
            spectators: [],
            yourId: 0,
        } as Room;
        const param: BodyRoomUpdate = {
            isAdmin: true,
            isPlaying: true,
            allPieces: true,
            malus: true,
            size: {w: 5, h: 10},
            gameSpeed: {
                speed: 4,
                acceleration: true,
                frequency: 30,
                rate: 2,
                max: 20,
            },
            players: [
                {id: 0, name: 'aderouba'},
                {id: 1, name: 'lumugot'},
            ],
            spectators: [
                {id: 2, name: 'vviovi'},
            ],
            yourId: 1,
        };

        // 2. Action
        const action = updateRoom(param);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.id).toBe('room-42');
        expect(newState.isPlaying).toBe(true);
        expect(newState.isAdmin).toBe(true);
        expect(newState.allPieces).toBe(true);
        expect(newState.malus).toBe(true);
        expect(newState.size.w).toBe(5);
        expect(newState.size.h).toBe(10);
        expect(newState.gameSpeed.speed).toBe(4);
        expect(newState.gameSpeed.acceleration).toBe(true);
        expect(newState.gameSpeed.frequency).toBe(30);
        expect(newState.gameSpeed.rate).toBe(2);
        expect(newState.gameSpeed.max).toBe(20);
        expect(newState.players).toStrictEqual([
            {id: 0, name: 'aderouba'},
            {id: 1, name: 'lumugot'},
        ]);
        expect(newState.spectators).toStrictEqual([
            {id: 2, name: 'vviovi'},
        ]);
        expect(newState.yourId).toBe(1);
    });
});
