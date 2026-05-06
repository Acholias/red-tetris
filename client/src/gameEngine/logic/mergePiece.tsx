import { type Piece } from '@shared/pieces';

export function mergePiece(piece1: Piece, piece2: Piece): Piece {
    // Create empty 5x5 cells
    let cells: string[] = Array(25).fill(' ');

    // Merge first piece
    const offset1 = computeOffset(piece1.width);
    for (let y = 0; y < piece1.height; y++) {
        for (let x = 0; x < piece1.width; x++) {
            const index1 = x + y * piece1.width;
            if (piece1.cells[index1] == ' ') continue;

            const index = (x + offset1) + (y + offset1) * 5;
            cells[index] = piece1.cells[index1];
        }
    }

    // Merge second piece
    const offset2 = computeOffset(piece2.width);
    for (let y = 0; y < piece2.height; y++) {
        for (let x = 0; x < piece2.width; x++) {
            const index2 = x + y * piece2.width;
            if (piece2.cells[index2] == ' ') continue;

            const index = (x + offset2) + (y + offset2) * 5;
            if (cells[index] != ' ') continue;

            cells[index] = piece2.cells[index2];
        }
    }

    return {
        cells: cells,
        x: piece1.x! - offset1,
        y: piece1.y! - offset1,
        width: 5,
        height: 5,
        rotationId: '5x5'
    };
}


function computeOffset(pieceSize: number): number {
    switch (pieceSize) {
        case 1:
            return 2;
        case 2:
            return 1;
        case 3:
            return 1;
    }
    return 0;
}
