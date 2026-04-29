import type { RotationId } from "./rotations";

export type PieceId = 'l' | 'j';

export const pieces: Record<PieceId, {
    cells: string[],
    width: number,
    height: number,
    rotationId: RotationId | null,
}> = {
    'j': {
        'cells': [
            'J', ' ', ' ',
            'J', 'J', 'J',
            ' ', ' ', ' ',
        ],
        'width': 3,
        'height': 3,
        'rotationId': '3x3',
    },
    'l': {
        'cells': [
            ' ', ' ', 'L',
            'L', 'L', 'L',
            ' ', ' ', ' ',
        ],
        'width': 3,
        'height': 3,
        'rotationId': '3x3',
    }
};


