import { describe, it, expect } from 'vitest';
import { mergePiece } from './mergePiece';
import type { Piece } from '@shared/pieces';

describe('merge piece', () => {
  it('merge 1x1 and 1x1', () => {
    // 1. Setup
    const piece1: Piece = {
        cells: [
            'O',
        ],
        x: 4,
        y: 2,
        width: 1,
        height: 1,
    };
    const piece2: Piece = {
        cells: [
            'T',
        ],
        width: 1,
        height: 1,
    };

    // 2. Action
    const result = mergePiece(piece1, piece2);

    // 3. Assert
    const expected: Piece = {
        cells: [
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', 'O', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ],
        x: 2,
        y: 0,
        width: 5,
        height: 5,
        rotationId: '5x5',
    };
    expect(result).toEqual(expected);
  });

  it('merge 2x2 and 1x1', () => {
    // 1. Setup
    const piece1: Piece = {
        cells: [
            'V', 'V',
            ' ', 'V',
        ],
        x: 4,
        y: 2,
        width: 2,
        height: 2,
    };
    const piece2: Piece = {
        cells: [
            'O',
        ],
        width: 1,
        height: 1,
    };

    // 2. Action
    const result = mergePiece(piece1, piece2);

    // 3. Assert
    const expected: Piece = {
        cells: [
            ' ', ' ', ' ', ' ', ' ',
            ' ', 'V', 'V', ' ', ' ',
            ' ', ' ', 'V', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ],
        x: 3,
        y: 1,
        width: 5,
        height: 5,
        rotationId: '5x5',
    };
    expect(result).toEqual(expected);
  });

  it('merge 1x1 and 2x2', () => {
    // 1. Setup
    const piece1: Piece = {
        cells: [
            'O',
        ],
        x: 4,
        y: 2,
        width: 1,
        height: 1,
    };
    const piece2: Piece = {
        cells: [
            'V', 'V',
            ' ', 'V',
        ],
        width: 2,
        height: 2,
    };

    // 2. Action
    const result = mergePiece(piece1, piece2);

    // 3. Assert
    const expected: Piece = {
        cells: [
            ' ', ' ', ' ', ' ', ' ',
            ' ', 'V', 'V', ' ', ' ',
            ' ', ' ', 'O', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ],
        x: 2,
        y: 0,
        width: 5,
        height: 5,
        rotationId: '5x5',
    };
    expect(result).toEqual(expected);
  });

  it('merge 4x4 and 3x3', () => {
    // 1. Setup
    const piece1: Piece = {
        cells: [
            ' ', ' ', 'T', ' ',
            'T', 'T', 'T', 'T',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        x: 4,
        y: 2,
        width: 4,
        height: 4,
    };
    const piece2: Piece = {
        cells: [
            ' ', 'V', ' ',
            'V', 'V', 'V',
            ' ', 'V', ' ',
        ],
        width: 3,
        height: 3,
    };

    // 2. Action
    const result = mergePiece(piece1, piece2);

    // 3. Assert
    const expected: Piece = {
        cells: [
            ' ', ' ', 'T', ' ', ' ',
            'T', 'T', 'T', 'T', ' ',
            ' ', 'V', 'V', 'V', ' ',
            ' ', ' ', 'V', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ],
        x: 4,
        y: 2,
        width: 5,
        height: 5,
        rotationId: '5x5',
    };
    expect(result).toEqual(expected);
  });
});
