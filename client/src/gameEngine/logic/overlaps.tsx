import type { Grid } from "../data/grid";
import type { Piece } from "../data/pieces";

export const kickTests = [
    { dx:  0, dy:  0 },
    { dx:  1, dy:  0 },
    { dx: -1, dy:  0 },
    { dx:  0, dy: -1 },
    { dx:  2, dy:  0 },
    { dx: -2, dy:  0 }
];

export function isPieceOverlap(
            grid: Grid,
            piece: Piece): boolean {
    if (piece.x == null || piece.y == null) return false;

    const length = piece.width * piece.height;
    for (let i = 0; i < length; i++) {
        if (piece.cells[i] == ' ') continue;

        const cx = i % piece.width + piece.x;
        if (cx < 0 || cx >= grid.width) return true;

        const cy = Math.floor(i / piece.width) + piece.y;
        if (cy < 0 || cy >= grid.height) return true;

        if (grid.cells[cx + cy * grid.width] != 'E') return true;
    }
    return false;
}
