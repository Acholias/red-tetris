import { describe, it, expect } from 'vitest';
import { Piece } from './piece.js';
import { Grid } from './grid.js';

describe('isPieceOverlap', () => {
    it('empty grid', () => {
        // 1. Setup
        const piece: Piece = new Piece('l');
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        const result = grid.isPieceOverlap(piece);

        // 3. Assert
        const expected: boolean = false;

        expect(result).toEqual(expected);
    });

    it('out of grid X', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');
        piece.x = -1;
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        const result = grid.isPieceOverlap(piece);

        // 3. Assert
        const expected: boolean = true;

        expect(result).toEqual(expected);
    });

    it('out of grid Y', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');
        piece.y = -1;
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        const result = grid.isPieceOverlap(piece);

        // 3. Assert
        const expected: boolean = true;

        expect(result).toEqual(expected);
    });

    it('overlap', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');
        const grid: Grid = new Grid(3, 3);
        grid.cells[0] = 'U';

        // 2. Action
        const result = grid.isPieceOverlap(piece);

        // 3. Assert
        const expected: boolean = true;

        expect(result).toEqual(expected);
    });

    it('not overlap', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');
        const grid: Grid = new Grid(3, 3);
        grid.cells[8] = 'U';

        // 2. Action
        const result = grid.isPieceOverlap(piece);

        // 3. Assert
        const expected: boolean = false;

        expect(result).toEqual(expected);
    });
});


describe('fixPiece', () => {
    it('O on empty grid', () => {
        // 1. Setup
        const piece: Piece = new Piece('l');
        piece.y = 1;
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        const result = grid.fixPiece(piece);

        // 3. Assert
        const expectedResult: boolean = false;
        const expectedGrid: Grid = new Grid(3, 3);
        expectedGrid.cells = [
            'E', 'E', 'E',
            'E', 'E', 'L',
            'L', 'L', 'L',
        ];
        expectedGrid.spectrum.heights = [
            1, 1, 2
        ];

        expect(result).toEqual(expectedResult);
        expect(grid).toEqual(expectedGrid);
    });

    it('O out of grid X', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');
        piece.x = -1;
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        const result = grid.fixPiece(piece);

        // 3. Assert
        const expectedResult: boolean = true;
        const expectedGrid: Grid = new Grid(3, 3);

        expect(result).toEqual(expectedResult);
        expect(grid).toEqual(expectedGrid);
    });

    it('O out of grid Y', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');
        piece.y = 10;
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        const result = grid.fixPiece(piece);

        // 3. Assert
        const expectedResult: boolean = true;
        const expectedGrid: Grid = new Grid(3, 3);

        expect(result).toEqual(expectedResult);
        expect(grid).toEqual(expectedGrid);
    });

    it('O on not empty grid', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');
        piece.y = 1;
        const grid: Grid = new Grid(3, 3);
        grid.cells = [
            'E', 'E', 'J',
            'E', 'E', 'J',
            'E', 'J', 'J',
        ];
        grid.spectrum.heights = [
            0, 1, 3
        ];

        // 2. Action
        const result = grid.fixPiece(piece);

        // 3. Assert
        const expectedResult: boolean = true;
        const expectedGrid: Grid = new Grid(3, 3);
        expectedGrid.cells = [
            'E', 'E', 'J',
            'O', 'O', 'J',
            'O', 'J', 'J',
        ];
        expectedGrid.spectrum.heights = [
            2, 2, 3
        ];

        expect(result).toEqual(expectedResult);
        expect(grid).toEqual(expectedGrid);
    });
});



describe('clearLines', () => {
    it('empty grid', () => {
        // 1. Setup
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        const result = grid.clearLines();

        // 3. Assert
        const expectedResult: number = 0;
        const expectedGrid: Grid = new Grid(3, 3);

        expect(result).toEqual(expectedResult);
        expect(grid).toEqual(expectedGrid);
    });

    it('2 line grid', () => {
        // 1. Setup
        const grid: Grid = new Grid(3, 3);
        grid.cells = [
            'E', 'E', 'E',
            'E', 'E', 'L',
            'L', 'L', 'L',
        ];
        grid.spectrum.heights = [
            1, 1, 2
        ];

        // 2. Action
        const result = grid.clearLines();

        // 3. Assert
        const expectedResult: number = 1;
        const expectedGrid: Grid = new Grid(3, 3);
        expectedGrid.cells = [
            'E', 'E', 'E',
            'E', 'E', 'E',
            'E', 'E', 'L',
        ];
        expectedGrid.spectrum.heights = [
            0, 0, 1
        ];

        expect(result).toEqual(expectedResult);
        expect(grid).toEqual(expectedGrid);
    });
});


describe('addUnbreakableLines', () => {
    it('empty grid, no line', () => {
        // 1. Setup
        const grid: Grid = new Grid(3, 3);

        // 2. Action
        grid.addUnbreakableLines(0);

        // 3. Assert
        const expected: Grid = new Grid(3, 3);

        expect(grid).toEqual(expected);
    });

    it('not empty grid, 1 line', () => {
        // 1. Setup
        const grid: Grid = new Grid(3, 3);
        grid.cells = [
            'E', 'E', 'E',
            'E', 'E', 'L',
            'L', 'L', 'L',
        ];
        grid.spectrum.heights = [
            1, 1, 2
        ];

        // 2. Action
        grid.addUnbreakableLines(1);

        // 3. Assert
        const expected: Grid = new Grid(3, 3);
        expected.cells = [
            'E', 'E', 'L',
            'L', 'L', 'L',
            'U', 'U', 'U',
        ];
        expected.spectrum.heights = [
            1, 1, 2
        ];
        expected.spectrum.unbreakableLines = 1;

        expect(grid).toEqual(expected);
    });
});
