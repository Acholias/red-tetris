import { PieceId } from "./pieces.js";
import { listLengthPieceAll, listLengthPieceBasic } from "./defines.js";
import { Grid } from "./grid.js";
import { Piece } from "./piece.js";

const kickTests = [
    { dx:  0, dy:  0 },
    { dx:  1, dy:  0 },
    { dx: -1, dy:  0 },
    { dx:  0, dy: -1 },
    { dx:  2, dy:  0 },
    { dx: -2, dy:  0 }
];

export class PlayerData {
    playerId: string;
    grid: Grid;
    piece: Piece;
    nextPieceId: PieceId;
    nextPieceIndex: number;
    alive: boolean;

    constructor(
        playerId: string,
        gridSize: {w: number, h: number},
        pieceId: PieceId,
        nextPieceId: PieceId
    ) {
        this.playerId = playerId;
        this.grid = new Grid(gridSize.w, gridSize.h);
        this.piece = new Piece(pieceId, gridSize.w);
        this.nextPieceId = nextPieceId;
        this.nextPieceIndex = 2;
        this.alive = true;
    }

    setNextPiece(nextPieceId: PieceId, allPiece: boolean) {
        if (!this.alive) return;

        this.piece = new Piece(this.nextPieceId, this.grid.width);
        this.nextPieceId = nextPieceId;

        if (allPiece) {
            this.nextPieceIndex = (this.nextPieceIndex + 1) % listLengthPieceBasic;
        } else {
            this.nextPieceIndex = (this.nextPieceIndex + 1) % listLengthPieceAll;
        }

        if (this.grid.isPieceOverlap(this.piece)) this.alive = false;
    }

    leftPiece() {
        if (!this.alive) return;
        this.piece.x -= 1;
        if (this.grid.isPieceOverlap(this.piece)) this.piece.x += 1;
    }

    rightPiece() {
        if (!this.alive) return;
        this.piece.x += 1;
        if (this.grid.isPieceOverlap(this.piece)) this.piece.x -= 1;
    }

    rotatePiece() {
        if (!this.alive) return;

        const piece = this.piece.copyWith({});
        piece.rotate();

        for (const test of kickTests) {
            const testPiece = piece.copyWith({
                x: piece.x + test.dx,
                y: piece.y + test.dy
            });

            if (!this.grid.isPieceOverlap(testPiece)) {
                this.piece = testPiece;
                return;
            }
        }
    }

    softDrop(): boolean {
        if (!this.alive) return false;

        this.piece.y += 1;
        if (!this.grid.isPieceOverlap(this.piece)) return false;

        this.piece.y -= 1;
        if (this.grid.fixPiece(this.piece)) this.alive = false;

        return true;
    }

    hardDrop() {
        if (!this.alive) return;

        this.piece.y += 1;
        while (!this.grid.isPieceOverlap(this.piece)) {
            this.piece.y += 1;
        }
        this.piece.y -= 1;

        if (this.grid.fixPiece(this.piece)) this.alive = false;
    }
}
