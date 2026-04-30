import type { Grid } from "./grid";
import type { Piece } from "./pieces";

export interface GameData {
    speed: number;
    allPieces: boolean;
    waitNextPiece: boolean;
    isEnd: boolean;
    grid: Grid;
    piece: Piece;
    nextPiece: Piece;
}
