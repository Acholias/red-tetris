import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderCells, renderSpectrum } from './render';
import type { SpectrumData } from '../data/spectrumsSlice';

describe('renderCells', () => {
    it('render ', () => {
        const cells: string[] = [
            'S'
        ];
        const x: number = 1;
        const y: number = 1;
        const w: number = 1;
        const h: number = 1;

        const { container } = render(renderCells(cells, x, y, w, h));

        expect(container.firstChild).toHaveProperty('className', 'game-grid');
        expect(container.firstChild?.firstChild).toHaveProperty('className', 'game-cell cell-S');
    });
});


describe('renderSpectrum', () => {
    it('render ', () => {

        const spectrumData: SpectrumData = {
            playerName: 'aderouba',
            spectrum : {
                heights: [4, 2],
                unbreakableLines: 1
            },
            grid: {
                cells: ['S'],
                width: 1,
                height: 1,
            },
        };

        const { container } = render(renderSpectrum(spectrumData));

        expect(container.firstChild).toHaveProperty('className', 'spectrum');
        expect(container.firstChild?.textContent).toBe('aderouba');
    });
});
