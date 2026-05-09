import { describe, it, expect } from 'vitest';
import { createRoomTheme, createGameTheme, createSpectrumTheme } from './theme';
import type { Room } from '../gameRoom/data/room';
import type { ThemeData } from './themeData';

describe('theme', () => {
    it('createRoomTheme', () => {
        // Setup
        const themeData = {
            themeRoom: {
                player_background: 'bg-p',
                you_background: 'bg-y',
                player_color: 'c-p',
            }
        } as ThemeData;

        // Action
        const result = createRoomTheme(themeData);

        // Assert
        expect(result).toEqual({
            '--player-background': 'bg-p',
            '--you-background': 'bg-y',
            '--player-color': 'c-p',
        });
    });

    it('createGameTheme', () => {
        // Setup
        const themeData = {
            themeGame: {
                color_E: 'cE', color_I: 'cI', color_J: 'cJ', color_L: 'cL',
                color_M: 'cM', color_O: 'cO', color_S: 'cS', color_T: 'cT',
                color_U: 'cU', color_V: 'cV', color_Z: 'cZ',
                texture_E: 'tE', texture_I: 'tI', texture_J: 'tJ', texture_L: 'tL',
                texture_M: 'tM', texture_O: 'tO', texture_S: 'tS', texture_T: 'tT',
                texture_U: 'tU', texture_V: 'tV', texture_Z: 'tZ',
            }
        } as ThemeData;

        // Action
        const result = createGameTheme(themeData, 5);

        // Assert
        expect(result).toEqual({
            '--cell-size': '5vh',
            '--color-E': 'cE', '--color-I': 'cI', '--color-J': 'cJ', '--color-L': 'cL',
            '--color-M': 'cM', '--color-O': 'cO', '--color-S': 'cS', '--color-T': 'cT',
            '--color-U': 'cU', '--color-V': 'cV', '--color-Z': 'cZ',
            '--texture-E': 'tE', '--texture-I': 'tI', '--texture-J': 'tJ', '--texture-L': 'tL',
            '--texture-M': 'tM', '--texture-O': 'tO', '--texture-S': 'tS', '--texture-T': 'tT',
            '--texture-U': 'tU', '--texture-V': 'tV', '--texture-Z': 'tZ',
        });
    });

    it('createSpectrumTheme', () => {
        // Setup
        const themeData = {
            themeGame: {
                color_E: 'cE', color_M: 'cM', color_U: 'cU',
                texture_E: 'tE', texture_M: 'tM', texture_U: 'tU',
            }
        } as ThemeData;
        const room = {
            size: { w: 10, h: 20 }
        } as Room;

        // Action
        const result = createSpectrumTheme(themeData, 2, 4, room);

        // Assert
        expect(result).toEqual({
            '--cell-size': '4vh',
            '--margin': '40vh',
            '--spectrum-w': '60vh',
            '--spectrum-h': '108vh',
            '--color-E': 'cE',
            '--color-M': 'cM',
            '--color-U': 'cU',
            '--texture-E': 'tE',
            '--texture-M': 'tM',
            '--texture-U': 'tU',
        });
    });
});
