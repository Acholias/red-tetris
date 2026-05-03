import { Piece } from "./piece.js";

const kickTests = [
    { dx:  0, dy:  0 },
    { dx:  1, dy:  0 },
    { dx: -1, dy:  0 },
    { dx:  0, dy: -1 },
    { dx:  2, dy:  0 },
    { dx: -2, dy:  0 }
];

export class Grid {
    width: number;
    height: number;
    nbCells: number;
    cells: string[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.nbCells = width * height;
        this.cells = [];
        for (let i = 0; i < this.nbCells; i++) {
            this.cells.push('E');
        }
    }

    isPieceOverlap(piece: Piece): boolean {
        const length = piece.width * piece.height;
        for (let i = 0; i < length; i++) {
            if (piece.cells[i] == ' ') continue;

            const cx = i % piece.width + piece.x;
            if (cx < 0 || cx >= this.width) return true;

            const cy = Math.floor(i / piece.width) + piece.y;
            if (cy < 0 || cy >= this.height) return true;

            if (this.cells[cx + cy * this.width] != 'E') return true;
        }
        return false;
    }
}
