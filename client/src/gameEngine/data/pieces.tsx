import type { RotationId } from "../logic/rotations";

export interface Piece {
    cells: string[];
    x?: number;
    y?: number;
    width: number;
    height: number;
    rotationId?: RotationId,
}

export type PieceId =
    '1' | '2' | 'v' | '3' | 'V' | 'l' |
    'j' | 't' | 'T' | 's' | 'z' | 'U' |
    'P' | 'Q' | 'W' | 'X' | 'S' | 'Z' |
    'F' | 'f' | 'O' | '4' | 'L' | 'J' |
    'N' | 'n' | 'Y' | 'y' | '5';

export const basicPieceIds: PieceId[] = [
    'O', 'l', 'j', 't', 's', 'z', '4'
];
export const allPieceIds: PieceId[] = [
    '1', '2', 'v', 'O', '3', 'V',
    'l', 'j', 't', 'T', 's', 'z',
    'U', 'P', 'Q', 'W', 'X', 'S',
    'Z', 'F', 'f', '4', 'L', 'J',
    'N', 'n', 'Y', 'y', '5'
];

interface PieceData {
    cells: string[],
    size: number,
    rotationId?: RotationId,
}

export const pieces: Record<PieceId, PieceData> = {
    // 1x1
    '1': {
        'cells': [
            'O',
        ],
        'size': 1,
    },

    // 2x2
    '2': {
        'cells': [
            'I', 'I',
            ' ', ' ',
        ],
        'size': 2,
        'rotationId': '2x2',
    },
    'v': {
        'cells': [
            'V', ' ',
            'V', 'V',
        ],
        'size': 2,
        'rotationId': '2x2',
    },
    'O': {
        'cells': [
            'O', 'O',
            'O', 'O',
        ],
        'size': 2,
    },

    // 3x3
    '3': {
        'cells': [
            ' ', ' ', ' ',
            'I', 'I', 'I',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'V': {
        'cells': [
            'V', ' ', ' ',
            'V', ' ', ' ',
            'V', 'V', 'V',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'l': {
        'cells': [
            ' ', ' ', 'L',
            'L', 'L', 'L',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'j': {
        'cells': [
            'J', ' ', ' ',
            'J', 'J', 'J',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    't': {
        'cells': [
            ' ', 'T', ' ',
            'T', 'T', 'T',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'T': {
        'cells': [
            ' ', 'T', ' ',
            ' ', 'T', ' ',
            'T', 'T', 'T',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    's': {
        'cells': [
            'S', 'S', ' ',
            ' ', 'S', 'S',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'z': {
        'cells': [
            ' ', 'Z', 'Z',
            'Z', 'Z', ' ',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'U': {
        'cells': [
            'O', ' ', 'O',
            'O', 'O', 'O',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'P': {
        'cells': [
            'O', 'O', ' ',
            'O', 'O', 'O',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'Q': {
        'cells': [
            ' ', 'O', 'O',
            'O', 'O', 'O',
            ' ', ' ', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'W': {
        'cells': [
            'V', ' ', ' ',
            'V', 'V', ' ',
            ' ', 'V', 'V',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'X': {
        'cells': [
            ' ', 'V', ' ',
            'V', 'V', 'V',
            ' ', 'V', ' ',
        ],
        'size': 3,
    },
    'S': {
        'cells': [
            'S', 'S', ' ',
            ' ', 'S', ' ',
            ' ', 'S', 'S',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'Z': {
        'cells': [
            ' ', 'Z', 'Z',
            ' ', 'Z', ' ',
            'Z', 'Z', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'F': {
        'cells': [
            ' ', 'L', ' ',
            'L', 'L', ' ',
            ' ', 'L', 'L',
        ],
        'size': 3,
        'rotationId': '3x3',
    },
    'f': {
        'cells': [
            ' ', 'L', ' ',
            ' ', 'L', 'L',
            'L', 'L', ' ',
        ],
        'size': 3,
        'rotationId': '3x3',
    },

    // 4x4
    '4': {
        'cells': [
            ' ', ' ', ' ', ' ',
            'I', 'I', 'I', 'I',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        'size': 4,
        'rotationId': '4x4',
    },
    'L': {
        'cells': [
            ' ', ' ', ' ', 'L',
            'L', 'L', 'L', 'L',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        'size': 4,
        'rotationId': '4x4',
    },
    'J': {
        'cells': [
            'J', ' ', ' ', ' ',
            'J', 'J', 'J', 'J',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        'size': 4,
        'rotationId': '4x4',
    },
    'N': {
        'cells': [
            'S', 'S', ' ', ' ',
            ' ', 'S', 'S', 'S',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        'size': 4,
        'rotationId': '4x4',
    },
    'n': {
        'cells': [
            ' ', ' ', 'Z', 'Z',
            'Z', 'Z', 'Z', ' ',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        'size': 4,
        'rotationId': '4x4',
    },
    'Y': {
        'cells': [
            ' ', ' ', 'T', ' ',
            'T', 'T', 'T', 'T',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        'size': 4,
        'rotationId': '4x4',
    },
    'y': {
        'cells': [
            ' ', 'T', ' ', ' ',
            'T', 'T', 'T', 'T',
            ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ',
        ],
        'size': 4,
        'rotationId': '4x4',
    },

    // 5x5
    '5': {
        'cells': [
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
            'I', 'I', 'I', 'I', 'I',
            ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ',
        ],
        'size': 5,
        'rotationId': '5x5',
    },
};
