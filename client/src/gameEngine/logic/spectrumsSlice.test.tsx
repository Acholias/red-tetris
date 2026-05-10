import { describe, it, expect } from 'vitest';
import roomReducer, { clearSpectrums, initSpectrums, updateSpectrum, type SpectrumData } from './spectrumsSlice';
import type { Room } from '../../gameRoom/data/room';
import type { BodyGameSpectrum } from '@shared/requestBody';


describe('initSpectrums', () => {
    it('skip current player', () => {
        // 1. Setup
        const room: Room = {
            id: 'room-42',
            isSocketConnected: true,
            isAdmin: true,
            isPlaying: true,
            allPieces: true,
            malus: true,
            size: {w: 10, h: 20},
            gameSpeed: {
                speed: 4,
                acceleration: true,
                frequency: 20,
                rate: 4,
                max: 42
            },
            players: [
                {id: 0, name: 'aderouba'},
                {id: 1, name: 'lumugot'},
            ],
            spectators: [],
            yourId: 0,
        };
        const initialState: {[key: number]: SpectrumData} = {};

        // 2. Action
        const action = initSpectrums({room: room, skipCurrentPlayer: true});
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(Object.keys(newState).length).toBe(1);
        const spectrumData1 = newState[1];
        expect(spectrumData1).not.toBe(undefined);
        expect(spectrumData1.grid.width).toBe(10);
        expect(spectrumData1.grid.height).toBe(20);
        expect(spectrumData1.spectrum.heights.length).toBe(10);
        expect(spectrumData1.spectrum.unbreakableLines).toBe(0);
    });
});


describe('updateSpectrum', () => {
    it('bad player', () => {
        // 1. Setup
        const initialState: {[key: number]: SpectrumData} = {};
        const gameSpectrum: BodyGameSpectrum = {
            playerId: 0,
            spectrum: {
                heights: [0, 0, 0],
                unbreakableLines: 0
            },
        }

        // 2. Action
        const action = updateSpectrum(gameSpectrum);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(Object.keys(newState).length).toBe(0);
    });

    it('updates', () => {
        // 1. Setup
        const initialState: {[key: number]: SpectrumData} = {
            0: {
                playerName: 'aderouba',
                spectrum: {
                    heights: [0, 0, 0],
                    unbreakableLines: 0
                },
                grid: {
                    width: 3,
                    height: 3,
                    cells: [
                        'E', 'E', 'E',
                        'E', 'E', 'E',
                        'E', 'E', 'E',
                    ]
                }
            }
        };
        const gameSpectrum: BodyGameSpectrum = {
            playerId: 0,
            spectrum: {
                heights: [1, 2, 0],
                unbreakableLines: 1
            },
        }

        // 2. Action
        const action = updateSpectrum(gameSpectrum);
        const newState = roomReducer(initialState, action);

        // 3. Assert
        expect(Object.keys(newState).length).toBe(1);
        const spectrumData = newState[0];
        expect(spectrumData).not.toBe(undefined);
        expect(spectrumData.spectrum.heights.length).toBe(3);
        expect(spectrumData.spectrum.heights).toStrictEqual([1, 2, 0]);
        expect(spectrumData.spectrum.unbreakableLines).toBe(1);
        expect(spectrumData.grid.width).toBe(3);
        expect(spectrumData.grid.height).toBe(3);
        expect(spectrumData.grid.cells).toStrictEqual([
            'E', 'M', 'E',
            'M', 'M', 'E',
            'U', 'U', 'U',
        ]);
    });
});


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
