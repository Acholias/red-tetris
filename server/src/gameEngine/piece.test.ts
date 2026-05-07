import { describe, it, expect } from 'vitest';
import { Piece } from './piece.js';

describe('rotate piece', () => {
    it('rotate O', () => {
        // 1. Setup
        const piece: Piece = new Piece('O');

        // 2. Action
        piece.rotate();

        // 3. Assert
        const expected: Piece = new Piece('O');

        expect(piece).toEqual(expected);
    });

    it('rotate l', () => {
        // 1. Setup
        const piece: Piece = new Piece('l');

        // 2. Action
        piece.rotate();

        // 3. Assert
        const expected: Piece = new Piece('l');
        expected.cells = [
            ' ', 'L', ' ',
            ' ', 'L', ' ',
            ' ', 'L', 'L',
        ];

        expect(piece).toEqual(expected);
    });
});


describe('merge piece', () => {
    it('merge 1x1 and 1x1', () => {
        // 1. Setup
        const piece1: Piece = new Piece('');
        piece1.cells = [
            'O',
        ];
        piece1.x = 4;
        piece1.y = 2;
        piece1.width = 1;
        piece1.height = 1;

        const piece2: Piece = new Piece('');
        piece2.cells = [
            'T',
        ];
        piece2.width = 1;
        piece2.height = 1;

        // 2. Action
        piece1.mergeWith(piece2);

        // 3. Assert
        const expected: Piece = new Piece('');
        expected.cells = [
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', 'O', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ];
        expected.x = 2;
        expected.y = 0;
        expected.width = 5;
        expected.height = 5;
        expected.rotationId = '5x5';

        expect(piece1).toEqual(expected);
    });

    it('merge 2x2 and 1x1', () => {
        // 1. Setup
        const piece1: Piece = new Piece('');
        piece1.cells = [
            'V', 'V',
            ' ', 'V',
        ];
        piece1.x = 4;
        piece1.y = 2;
        piece1.width = 2;
        piece1.height = 2;

        const piece2: Piece = new Piece('');
        piece2.cells = [
            'O',
        ];
        piece2.width = 1;
        piece2.height = 1;

        // 2. Action
        piece1.mergeWith(piece2);

        // 3. Assert
        const expected: Piece = new Piece('')
        expected.cells = [
            ' ', ' ', ' ', ' ', ' ',
            ' ', 'V', 'V', ' ', ' ',
            ' ', ' ', 'V', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ];
        expected.x = 3;
        expected.y = 1;
        expected.width = 5;
        expected.height = 5;
        expected.rotationId = '5x5';

        expect(piece1).toEqual(expected);
    });

    it('merge 1x1 and 2x2', () => {
        // 1. Setup
        const piece1: Piece = new Piece('');
        piece1.cells = [
            'O',
        ];
        piece1.x = 4;
        piece1.y = 2;
        piece1.width = 1;
        piece1.height = 1;

        const piece2: Piece = new Piece('');
        piece2.cells = [
            'V', 'V',
            ' ', 'V',
        ];
        piece2.width = 2;
        piece2.height = 2;

        // 2. Action
        piece1.mergeWith(piece2);

        // 3. Assert
        const expected: Piece = new Piece('');
        expected.cells = [
            ' ', ' ', ' ', ' ', ' ',
            ' ', 'V', 'V', ' ', ' ',
            ' ', ' ', 'O', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ];
        expected.x = 2;
        expected.y = 0;
        expected.width = 5;
        expected.height = 5;
        expected.rotationId = '5x5';

        expect(piece1).toEqual(expected);
    });

    it('merge 4x4 and 3x3', () => {
        // 1. Setup
        const piece1: Piece = new Piece('');
        piece1.cells = [
            ' ', ' ', 'T', ' ',
            'T', 'T', 'T', 'T',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        piece1.x = 4;
        piece1.y = 2;
        piece1.width = 4;
        piece1.height = 4;

        const piece2: Piece = new Piece('');
        piece2.cells = [
            ' ', 'V', ' ',
            'V', 'V', 'V',
            ' ', 'V', ' ',
        ],
        piece2.width = 3;
        piece2.height = 3;

        // 2. Action
        piece1.mergeWith(piece2);

        // 3. Assert
        const expected: Piece = new Piece('');
        expected.cells = [
            ' ', ' ', 'T', ' ', ' ',
            'T', 'T', 'T', 'T', ' ',
            ' ', 'V', 'V', 'V', ' ',
            ' ', ' ', 'V', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ],
        expected.x = 4;
        expected.y = 2;
        expected.width = 5;
        expected.height = 5;
        expected.rotationId = '5x5';

        expect(piece1).toEqual(expected);
    });
});


describe('copyWith', () => {
    it('simple copy', () => {
        // 1. Setup
        const piece: Piece = new Piece('t', 10);

        // 2. Action
        const result = piece.copyWith({});

        // 3. Assert
        const expected: Piece = new Piece('t', 10);

        expect(result).toEqual(expected);
    });

    it('change x', () => {
        // 1. Setup
        const piece: Piece = new Piece('z', 10);

        // 2. Action
        const result = piece.copyWith({x: 0});

        // 3. Assert
        const expected: Piece = new Piece('z', 10);
        expected.x = 0;

        expect(result).toEqual(expected);
    });

    it('change y', () => {
        // 1. Setup
        const piece: Piece = new Piece('s', 10);

        // 2. Action
        const result = piece.copyWith({y: 12});

        // 3. Assert
        const expected: Piece = new Piece('s', 10);
        expected.y = 12;

        expect(result).toEqual(expected);
    });

    it('change x, y and cells', () => {
        // 1. Setup
        const piece: Piece = new Piece('s', 10);
        piece.cells[0] = 'e';

        // 2. Action
        const result = piece.copyWith({x: -1, y: 12});

        // 3. Assert
        const expected: Piece = new Piece('s', 10);
        expected.x = -1;
        expected.y = 12;
        expected.cells[0] = 'e';

        expect(result).toEqual(expected);
    });
});
