export type RotationId = '2x2' | '3x3' | '4x4' | '5x5';
export type RotateFunction = (cells: string[]) => string[];

function rotate2x2(cells: string[]) {
    return [
        cells[2], cells[0],
        cells[3], cells[1],
    ];
}

function rotate3x3(cells: string[]) {
    return [
        cells[6], cells[3], cells[0],
        cells[7], cells[4], cells[1],
        cells[8], cells[5], cells[2],
    ];
}

function rotate4x4(cells: string[]) {
    return [
        cells[12], cells[ 8], cells[ 4], cells[ 0],
        cells[13], cells[ 9], cells[ 5], cells[ 1],
        cells[14], cells[10], cells[ 6], cells[ 2],
        cells[15], cells[11], cells[ 7], cells[ 3],
    ];
}

function rotate5x5(cells: string[]) {
    return [
        cells[20], cells[15], cells[10], cells[ 5], cells[ 0],
        cells[21], cells[16], cells[11], cells[ 6], cells[ 1],
        cells[22], cells[17], cells[12], cells[ 7], cells[ 2],
        cells[23], cells[18], cells[13], cells[ 8], cells[ 3],
        cells[24], cells[19], cells[14], cells[ 9], cells[ 4],
    ];
}

export const rotations: Record<RotationId, RotateFunction> = {
    '2x2': rotate2x2,
    '3x3': rotate3x3,
    '4x4': rotate4x4,
    '5x5': rotate5x5,
};
