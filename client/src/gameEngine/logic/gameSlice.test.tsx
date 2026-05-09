import { describe, it, expect } from 'vitest';
import roomReducer, { endGame } from './gameSlice';
import type { GameData } from '../data/gameData';

const defaultState: GameData = {
            speed: {
                speed: 0,
                acceleration: false,
                frequency: 0,
                rate: 0,
                max: 0,
            },
            tickBeforeAccelerate: 0,
            tickDrunk: 0,
            allPieces: false,
            waitNextPiece: false,
            isEnd: false,
            grid: {
                cells: [],
                width: 0,
                height: 0,
            },
            piece: {
                cells: [],
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            nextPiece: {
                cells: [],
                width: 0,
                height: 0,
            }
        } as GameData;

describe('roomSlice', () => {
    it('test', () => {
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
