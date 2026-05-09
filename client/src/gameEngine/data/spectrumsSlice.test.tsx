import { describe, it, expect } from 'vitest';
import roomReducer, { clearSpectrums, type SpectrumData } from './spectrumsSlice';


describe('clearSpectrums', () => {
    it('clearSpectrums', () => {
        // 1. Setup
        const initialState: {[key: number]: SpectrumData} = {};

        // 2. Action
        const action = clearSpectrums();
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(Object.keys(newState).length).toBe(0);
    });
});
