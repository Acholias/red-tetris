import { BodyGameEnd, BodyGameSpectrum, BodyGameUpdate, BodyGameNextPiece, BodyGameMalus } from "@shared/requestBody";
import { server } from "../index.js";
import { Player } from "../room/player.js";
import { nbLoopPieceAll, nbLoopPieceBasic } from "./defines.js";
import { allPieceIds, basicPieceIds, type PieceId } from "@shared/pieces";
import { MalusEvent, PlayerData } from "./playerData.js";
import { rooms } from "../room/room.js";
import { GameSpeed } from "@shared/interfaces";
import { MalusId, allMalus } from "@shared/malus";

export interface GameEvent {
    id: string,
    type: string,
    win?: boolean,
    grid?: string[],
    spectrum?: {
        heights: number[],
        unbreakableLines: number
    },
    nextPiece?: PieceId,
    malusId?: MalusId,
}

export class GameData {
    solo: boolean;
    isEnd: boolean;
    allPieces: boolean;
    malus: boolean;
    gameSpeed: GameSpeed;
    pieces: PieceId[];
    playerDatas: Map<string, PlayerData>;

    constructor() {
        this.solo = true;
        this.isEnd = false;
        this.allPieces = false;
        this.malus = false;
        this.gameSpeed = {
            speed: 0,
            acceleration: false,
            frequency: 0,
            rate: 0,
            max: 0,
        };
        this.pieces = [];
        this.playerDatas = new Map();
    }

    startGame(
        roomId: string,
        allPieces: boolean,
        malus: boolean,
        gridSize: {w: number, h: number},
        gameSpeed: GameSpeed,
        players: Player[],
    ) {
        this.solo = players.length == 1;
        this.isEnd = false;
        this.allPieces = allPieces;
        this.malus = malus;
        this.gameSpeed = gameSpeed;

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

        setTimeout(() => autoTick(roomId), (1 / gameSpeed.speed) * 1000);
    }

    removePlayer(playerId: string): GameEvent[] {
        if (this.solo || this.isEnd) return [];
        if (!this.playerDatas.delete(playerId)) return [];

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
            return [{
                'id': lastAlive,
                'type' : 'end',
                'win' : true
            },
            {
                'id': '',
                'type' : 'finished',
            }];
        }
        return [];
    }

    playerAction(playerId: string, action: string): GameEvent[] {
        const playerData = this.playerDatas.get(playerId);
        if (playerData == null || this.isEnd) return [];

        if (action == 'left') playerData.leftPiece();
        else if (action == 'right') playerData.rightPiece();
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

            if (this.malus) playerData.tickMalus();
            if (playerData.softDrop()) {
                results = results.concat(this._fixPiece(playerData));
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

        let results: GameEvent[] = [{
            'id': playerData.playerId,
            'type': 'update-grid',
            'grid': playerData.grid.cells,
            'nextPiece': nextPieceId,
        },{
            'id': playerData.playerId,
            'type': 'spectrum',
            'spectrum': playerData.grid.spectrum,
        },
        ];

        const nbLinesClear = playerData.grid.clearLines();

        if (this.malus && nbLinesClear > 0) {
            const malusEvents = this._applyMalus(playerData.playerId, nbLinesClear);
            results = results.concat(malusEvents);
        }

        if (nbLinesClear > 1) {
            const unbreakableEvents = this._unbreakableLines(playerData.playerId, nbLinesClear - 1);
            results = results.concat(unbreakableEvents);
        }

        return results;
    }

    _playerLoose(playerId: string): GameEvent[] {
        const results: GameEvent[] = [{
            'id': playerId,
            'type' : 'end',
            'win' : false
        }];

        if (this.solo) {
            results.push({
                'id': '',
                'type' : 'finished',
            });
            this.isEnd = true;
            return results;
        }

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
            results.push({
                'id': '',
                'type' : 'finished',
            });
        }
        return results;
    }

    _unbreakableLines(playerId: string, nbLine: number): GameEvent[] {
        const results: GameEvent[] = [];

        for (const playerData of this.playerDatas.values()) {
            if (playerData.alive && playerData.playerId != playerId) {
                playerData.grid.addUnbreakableLines(nbLine);
                results.push({
                    'id': playerData.playerId,
                    'type': 'update-grid',
                    'grid': playerData.grid.cells,
                },{
                    'id': playerData.playerId,
                    'type': 'spectrum',
                    'spectrum': playerData.grid.spectrum,
                });
            }
        }

        return results;
    }

    _applyMalus(playerId: string, nbLine: number): GameEvent[] {
        if (Math.random() * 5 > nbLine) return [];

        const malusIndex = Math.floor(allMalus.length * Math.random());
        const malusId = allMalus[malusIndex];
        let results: GameEvent[] = [{
            'id': playerId,
            'type': 'malus',
            'malusId': malusId,
        }];

        for (const playerData of this.playerDatas.values()) {
            if (playerData.alive && playerData.playerId != playerId) {
                const event: MalusEvent = playerData.applyMalus(malusId);
                if (event == 'fix-piece') {
                    results = results.concat(this._fixPiece(playerData));
                }
                else if (event == 'next-piece') {
                    const nextPieceId = this.pieces[playerData.nextPieceIndex];
                    playerData.setNextPiece(nextPieceId, this.allPieces, false);
                    results.push({
                        'id': playerData.playerId,
                        'type': 'next-piece',
                        'nextPiece': playerData.nextPieceId,
                    });
                }
            }
        }

        return results;
    }
}


function autoTick(roomId: string) {
    const currentRoom = rooms.get(roomId);
    if (currentRoom == null || !currentRoom.isPlaying) return;

    const events: GameEvent[] = currentRoom.gamedata.tick();
    for (const event of events) {
        if (event.type == 'update-grid') {
            const body: BodyGameUpdate = {
                grid: event.grid!,
                nextPiece: event.nextPiece
            };
            server.sendSocketMessage(event.id, 'room/gameUpdate', body);
        }
        else if (event.type == 'spectrum') {
            const player = currentRoom.getPlayerById(event.id);
            if (player == null) continue;

            const body: BodyGameSpectrum = {
                playerId: player.idInRoom!,
                spectrum: event.spectrum!
            };
            server.sendSocketMessage(currentRoom.id, 'room/gameSpectrum', body);
        }
        else if (event.type == 'next-piece') {
            const player = currentRoom.getPlayerById(event.id);
            if (player == null) continue;

            const body: BodyGameNextPiece = {
                nextPiece: event.nextPiece!
            };
            server.sendSocketMessage(event.id, 'room/nextPiece', body);
        }
        else if (event.type == 'malus') {
            const player = currentRoom.getPlayerById(event.id);
            if (player == null) continue;

            const body: BodyGameMalus = {
                playerId: player.idInRoom!,
                malusId: event.malusId!,
            };
            server.sendSocketMessage(currentRoom.id, 'room/malus', body);
        }
        else if (event.type == 'end') {
            const body: BodyGameEnd = {
                win: event.win!
            };
            server.sendSocketMessage(event.id, 'room/gameEnd', body);
        }
        else if (event.type == 'finished') {
            currentRoom.isPlaying = false;
            server.sendSocketMessage(currentRoom.id, 'room/gameFinished', {});
        }
    }

    // Change game speed
    if (currentRoom.gamedata.gameSpeed.acceleration &&
        currentRoom.gamedata.gameSpeed.speed < currentRoom.gamedata.gameSpeed.max)
    {
        currentRoom.gamedata.gameSpeed.frequency--;
        if (currentRoom.gamedata.gameSpeed.frequency <= 0) {
            currentRoom.gamedata.gameSpeed.frequency = currentRoom.gameSpeed.frequency;
            currentRoom.gamedata.gameSpeed.speed += currentRoom.gamedata.gameSpeed.rate;
            if (currentRoom.gamedata.gameSpeed.speed > currentRoom.gamedata.gameSpeed.max) {
                currentRoom.gamedata.gameSpeed.speed = currentRoom.gamedata.gameSpeed.max;
            }
        }
    }

    if (currentRoom.isPlaying) {
        setTimeout(() => autoTick(roomId), (1 / currentRoom.gamedata.gameSpeed.speed) * 1000);
    }
}
