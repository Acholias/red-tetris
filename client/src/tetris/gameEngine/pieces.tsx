export type PieceId = 'l' | 'j';
export type RotateFunction = (cells: string[]) => string[];

function rotate3x3(cells: string[]) {
    return [
        cells[6], cells[3], cells[0],
        cells[7], cells[4], cells[1],
        cells[8], cells[5], cells[2],
    ];
}

export const pieces: Record<PieceId, {
    cells: string[],
    width: number,
    height: number,
    rotate: RotateFunction | null,
}> = {
    'j': {
        'cells': [
            'L', ' ',  ' ',
            'L', 'L',  'L',
            ' ', ' ',  ' ',
        ],
        'width': 3,
        'height': 3,
        'rotate': rotate3x3,
    },
    'l': {
        'cells': [
            ' ', ' ',  'J',
            'J', 'J',  'J',
            ' ', ' ',  ' ',
        ],
        'width': 3,
        'height': 3,
        'rotate': rotate3x3,
    }
};


