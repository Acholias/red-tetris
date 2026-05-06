import { describe, it, expect } from 'vitest';
import { Piece } from './piece.js';

describe('merge piece', () => {
  it('merge 1x1 and 1x1', () => {
    // 1. Setup
    const piece1: Piece = new Piece('1');
    piece1.cells = [
        'O',
    ];
    piece1.x = 4;
    piece1.y = 2;
    piece1.width = 1;
    piece1.height = 1;

    const piece2: Piece = new Piece('1');
    piece2.cells = [
        'T',
    ];
    piece2.width = 1;
    piece2.height = 1;

    // 2. Action
    piece1.mergeWith(piece2);

    // 3. Assert
    const expected: Piece = new Piece('1');
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

//   it('merge 2x2 and 1x1', () => {
//     // 1. Setup
//     const piece1: Piece = {
//         cells: [
//             'V', 'V',
//             ' ', 'V',
//         ],
//         x: 4,
//         y: 2,
//         width: 2,
//         height: 2,
//     };
//     const piece2: Piece = {
//         cells: [
//             'O',
//         ],
//         width: 1,
//         height: 1,
//     };

//     // 2. Action
//     const result = mergePiece(piece1, piece2);

//     // 3. Assert
//     const expected: Piece = {
//         cells: [
//             ' ', ' ', ' ', ' ', ' ',
//             ' ', 'V', 'V', ' ', ' ',
//             ' ', ' ', 'V', ' ', ' ',
//             ' ', ' ', ' ', ' ', ' ',
//             ' ', ' ', ' ', ' ', ' ',
//         ],
//         x: 3,
//         y: 1,
//         width: 5,
//         height: 5,
//         rotationId: '5x5'
//     };;
//     expect(result).toEqual(expected);
//   });

//   it('merge 1x1 and 2x2', () => {
//     // 1. Setup
//     const piece1: Piece = {
//         cells: [
//             'O',
//         ],
//         x: 4,
//         y: 2,
//         width: 1,
//         height: 1,
//     };
//     const piece2: Piece = {
//         cells: [
//             'V', 'V',
//             ' ', 'V',
//         ],
//         width: 2,
//         height: 2,
//     };

//     // 2. Action
//     const result = mergePiece(piece1, piece2);

//     // 3. Assert
//     const expected: Piece = {
//         cells: [
//             ' ', ' ', ' ', ' ', ' ',
//             ' ', 'V', 'V', ' ', ' ',
//             ' ', ' ', 'O', ' ', ' ',
//             ' ', ' ', ' ', ' ', ' ',
//             ' ', ' ', ' ', ' ', ' ',
//         ],
//         x: 2,
//         y: 0,
//         width: 5,
//         height: 5,
//         rotationId: '5x5'
//     };;
//     expect(result).toEqual(expected);
//   });

//   it('merge 4x4 and 3x3', () => {
//     // 1. Setup
//     const piece1: Piece = {
//         cells: [
//             ' ', ' ', 'T', ' ',
//             'T', 'T', 'T', 'T',
//             ' ', ' ', ' ', ' ',
//             ' ', ' ', ' ', ' ',
//         ],
//         x: 4,
//         y: 2,
//         width: 4,
//         height: 4,
//     };
//     const piece2: Piece = {
//         cells: [
//             ' ', 'V', ' ',
//             'V', 'V', 'V',
//             ' ', 'V', ' ',
//         ],
//         width: 3,
//         height: 3,
//     };

//     // 2. Action
//     const result = mergePiece(piece1, piece2);

//     // 3. Assert
//     const expected: Piece = {
//         cells: [
//             ' ', ' ', 'T', ' ', ' ',
//             'T', 'T', 'T', 'T', ' ',
//             ' ', 'V', 'V', 'V', ' ',
//             ' ', ' ', 'V', ' ', ' ',
//             ' ', ' ', ' ', ' ', ' ',
//         ],
//         x: 4,
//         y: 2,
//         width: 5,
//         height: 5,
//         rotationId: '5x5'
//     };;
//     expect(result).toEqual(expected);
//   });
});
