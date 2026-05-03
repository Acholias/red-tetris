import { Player } from "../room/player.js";
import { nbLoopPieceAll, nbLoopPieceBasic } from "./defines.js";
import { allPieceIds, basicPieceIds, PieceId } from "./pieces.js";
import { PlayerData } from "./playerData.js";

export interface GameEvent {
    id: string,
    type: string,
    win?: boolean,
    grid?: string[],
    nextPiece?: string
}

export class GameData {
    solo: boolean;
    isEnd: boolean;
    allPieces: boolean;
    pieces: PieceId[];
    playerDatas: Map<string, PlayerData>;

    constructor() {
        this.solo = true;
        this.isEnd = false;
        this.allPieces = false;
        this.pieces = [];
        this.playerDatas = new Map();
    }

    startGame(
        allPieces: boolean,
        gridSize: {w: number, h: number},
        players: Player[],
    ) {
        this.solo = players.length == 0;
        this.isEnd = false;
        this.allPieces = allPieces;

        this.pieces = [];
        if (allPieces) {
            let bucket = [...allPieceIds]

            for (let i = 0; i < nbLoopPieceAll; i++) {
                while (bucket.length > 0) {
                    const randomIndex = Math.floor(Math.random() * bucket.length);
                    const pieceId = bucket.splice(randomIndex, 1)[0];
                    this.pieces.push(pieceId);
                }
                bucket = [...allPieceIds]
            }
        } else {
            let bucket = [...basicPieceIds]

            for (let i = 0; i < nbLoopPieceBasic; i++) {
                while (bucket.length > 0) {
                    const randomIndex = Math.floor(Math.random() * bucket.length);
                    const pieceId = bucket.splice(randomIndex, 1)[0];
                    this.pieces.push(pieceId);
                }
                bucket = [...basicPieceIds]
            }
        }
        const pieceId = this.pieces[0];
        const nextPieceId = this.pieces[1];

        this.playerDatas = new Map();
        for (const player of players) {
            this.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }
    }

    playerAction(playerId: string, action: string): GameEvent[] {
        const playerData = this.playerDatas.get(playerId);
        if (playerData == null) return [];

        if (action == 'left') playerData.leftPiece();
        else if (action == 'right') playerData.leftPiece();
        else if (action == 'rotate') playerData.rotatePiece();
        else if (action == 'soft-drop') {
            if (!playerData.softDrop()) return [];
            return this._fixPiece(playerData);
        }
        else if (action == 'hard-drop') {
            playerData.hardDrop();
            return this._fixPiece(playerData);
        }

        return [];
    }

    tick(): GameEvent[] {
        if (this.isEnd) return [];

        let results: GameEvent[] = [];
        for (const playerData of this.playerDatas.values()) {
            if (!playerData.alive) continue;

            if (playerData.softDrop()) {
                results = results.concat(this._fixPiece(playerData));
            }
        }

        return results;
    }

    _playerLoose(playerId: string): GameEvent[] {
        const results: GameEvent[] = [{
            'id': playerId,
            'type' : 'end',
            'win' : false
        }];

        if (this.isEnd || this.solo) return results;

        let nbAlive = 0;
        let lastAlive = '';
        for (const playerData of this.playerDatas.values()) {
            if (playerData.alive) {
                nbAlive += 1;
                lastAlive = playerData.playerId;
            }
        }

        if (nbAlive == 1) {
            this.isEnd = true;
            results.push({
                'id': lastAlive,
                'type' : 'end',
                'win' : true
            });
        }
        return results;
    }

    _unbreakableLines(playerId: string, nbLine: number): GameEvent[] {
        const results: GameEvent[] = [];

        for (const playerData of this.playerDatas.values()) {
            if (playerData.alive && playerData.playerId != playerId) {
                results.push({
                    'id': playerData.playerId,
                    'type': 'update-grid',
                    'grid': playerData.grid.cells,
                });
            }
        }

        return results;
    }

    _fixPiece(playerData: PlayerData): GameEvent[] {
        const nextPieceId = this.pieces[playerData.nextPieceIndex];
        playerData.setNextPiece(nextPieceId, this.allPieces);

        if (!playerData.alive) {
            return this._playerLoose(playerData.playerId);
        }

        const results: GameEvent[] = [{
            'id': playerData.playerId,
            'type': 'update-grid',
            'grid': playerData.grid.cells,
            'nextPiece': nextPieceId,
        }];

        const nbLinesClear = playerData.grid.clearLines();
        if (nbLinesClear > 1) {
            const res = this._unbreakableLines(playerData.playerId, nbLinesClear - 1);
            return (res.concat(results));
        }

        return results;
    }
}
