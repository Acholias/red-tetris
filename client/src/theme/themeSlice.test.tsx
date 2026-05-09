import { describe, it, expect, vi } from 'vitest';
import themeReducer, { setTheme } from './themeSlice';

// Setup
vi.mock('./themeData', () => {
    const mockThemes = new Map();
    mockThemes.set('dark', { name: 'darkTheme' });

    return {
        blueTetrisTheme: { name: 'defaultTheme' },
        themesData: mockThemes
    };
});

describe('themeSlice', () => {
    // it('setTheme found', () => {
    //     // Setup
    //     const initialState = { name: 'defaultTheme' } as any;

    //     // Action
    //     const action = setTheme('darkTheme');
    //     const result = themeReducer(initialState, action);

    //     // Assert
    //     expect(result).toEqual({ name: 'defaultTheme' });
    // });

    it('setTheme not found', () => {
        // Setup
        const initialState = { name: 'defaultTheme' } as any;

        // Action
        const action = setTheme('unknown');
        const result = themeReducer(initialState, action);

        // Assert
        expect(result).toEqual({ name: 'defaultTheme' });
    });
});
