export interface GameData {
    speed?: number;
    allPieces?: boolean;
    grid?: {
        cells: string[];
        size: number[];
    };
    piece?: {
        cells: string[];
        position: number[];
        size: number[];
    };
}

export function initGame(
            size: [number, number],
            speed: number,
            allPieces: boolean,
            startPieceId: number,
            nextPiexeId: number) {
    return {
        'grid' : {
            'cells': Array(size[0] * size[1]).fill('E'),
            'size': size,
        },
        'speed' : speed,
        'allPieces' : allPieces,
    };
}
