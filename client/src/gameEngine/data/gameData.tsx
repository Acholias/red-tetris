import type { Grid } from "./grid";
import type { Piece } from "../../../../shared/pieces";
import type { GameSpeed } from "@shared/interfaces";

export interface GameData {
    speed: GameSpeed;
    tickBeforeAccelerate: number,
    tickDrunk: number;
    allPieces: boolean;
    waitNextPiece: boolean;
    isEnd: boolean;
    win?: boolean;
    grid: Grid;
    piece: Piece;
    nextPiece: Piece;
}
