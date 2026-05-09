import { describe, it, expect } from 'vitest';
import type { Piece } from "@shared/pieces";
import type { Grid } from "../data/grid";
import { isPieceOverlap } from "./overlaps";


describe('isPieceOverlap', () => {
    it('no pos', () => {
        // 1. Setup
        const piece: Piece = {
            width: 1,
            height: 1,
            cells: ['O'],
        };
        const grid: Grid = {
            width: 3,
            height: 3,
            cells: [
                'E', 'E', 'E',
                'E', 'E', 'E',
                'E', 'E', 'E',
            ],
        };

        // 2. Action
        const result = isPieceOverlap(grid, piece);

        // 3. Assert
        expect(result).toBe(false);
    });

    it('empty grid', () => {
        // 1. Setup
        const piece: Piece = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            cells: ['O'],
        };
        const grid: Grid = {
            width: 3,
            height: 3,
            cells: [
                'E', 'E', 'E',
                'E', 'E', 'E',
                'E', 'E', 'E',
            ],
        };

        // 2. Action
        const result = isPieceOverlap(grid, piece);

        // 3. Assert
        expect(result).toBe(false);
    });

    it('collid out X min', () => {
        // 1. Setup
        const piece: Piece = {
            x: -1,
            y: 0,
            width: 3,
            height: 3,
            cells: [
                ' ', ' ', ' ',
                'T', 'T', 'T',
                ' ', 'T', ' ',
            ],
        };
        const grid: Grid = {
            width: 3,
            height: 3,
            cells: [
                'E', 'E', 'E',
                'E', 'E', 'L',
                'L', 'L', 'L',
            ],
        };

        // 2. Action
        const result = isPieceOverlap(grid, piece);

        // 3. Assert
        expect(result).toBe(true);
    });

    it('collid out X max', () => {
        // 1. Setup
        const piece: Piece = {
            x: 1,
            y: 0,
            width: 3,
            height: 3,
            cells: [
                ' ', ' ', ' ',
                'T', 'T', 'T',
                ' ', 'T', ' ',
            ],
        };
        const grid: Grid = {
            width: 3,
            height: 3,
            cells: [
                'E', 'E', 'E',
                'E', 'E', 'L',
                'L', 'L', 'L',
            ],
        };

        // 2. Action
        const result = isPieceOverlap(grid, piece);

        // 3. Assert
        expect(result).toBe(true);
    });

    it('collid out Y max', () => {
        // 1. Setup
        const piece: Piece = {
            x: 0,
            y: 10,
            width: 3,
            height: 3,
            cells: [
                ' ', ' ', ' ',
                'T', 'T', 'T',
                ' ', 'T', ' ',
            ],
        };
        const grid: Grid = {
            width: 3,
            height: 3,
            cells: [
                'E', 'E', 'E',
                'E', 'E', 'L',
                'L', 'L', 'L',
            ],
        };

        // 2. Action
        const result = isPieceOverlap(grid, piece);

        // 3. Assert
        expect(result).toBe(true);
    });
});
