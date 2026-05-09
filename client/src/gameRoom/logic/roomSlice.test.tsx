import { describe, it, expect } from 'vitest';
import roomReducer, { setSocketConnected } from './roomSlice';
import type { Room } from '../data/room';

describe('roomSlice', () => {
    it('test', () => {
        // 1. Setup
        const initialState = { isSocketConnected: false } as Room;

        // 2. Action
        const action = setSocketConnected(true);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(newState.isSocketConnected).toBe(true);
    });
});
