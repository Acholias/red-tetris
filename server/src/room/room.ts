import { GameSpeed } from "@shared/interfaces.js";
import { GameData } from "../gameEngine/gameData.js";
import { Player } from "./player.js";

const maxNbPlayer = 5;

export class Room {
    id: string;
    adminId: string;
    isPlaying: boolean;
    allPieces: boolean;
    malus: boolean;
    size: {w: number, h: number};
    gameSpeed: GameSpeed;
    players: Player[];
    spectators: Player[];
    nextIdInRoom: number;
    gamedata: GameData;

    constructor(id: string, player: Player) {
        this.id = id;
        this.adminId = player.id;
        this.isPlaying = false;
        this.allPieces = false;
        this.malus = false;
        this.size = {w: 10, h: 20};
        this.gameSpeed = {
            speed: 2,
            acceleration: false,
            frequency: 60,
            rate: 1,
            max: 10,
        };
        this.players = [player];
        this.spectators = [];
        this.nextIdInRoom = 1;
        player.idInRoom = 0;
        this.gamedata = new GameData();
    }

    isAdmin(player: Player): boolean {
        return player.id === this.adminId;
    }

    addPlayer(newPlayer: Player) {
        // Check if player isn't already in room
        for (const player of this.players) {
            if (player.id == newPlayer.id) {
                return;
            }
        }

        if (!this.isPlaying && this.players.length < maxNbPlayer) {
            this.players.push(newPlayer);
        } else {
            this.spectators.push(newPlayer);
        }

        newPlayer.idInRoom = this.nextIdInRoom;
        this.nextIdInRoom++;
    }

    getPlayerById(playerId: string): Player|null {
        for (const player of this.players) {
            if (player.id == playerId) return player;
        }
        for (const player of this.spectators) {
            if (player.id == playerId) return player;
        }
        return null;
    }

    isPlayerSpectate(playerId: string): boolean {
        for (const player of this.spectators) {
            if (player.id == playerId) return true;
        }
        return false;
    }

    startGame() {
        this.gamedata.startGame(
            this.id,
            this.allPieces,
            this.size,
            this.gameSpeed,
            this.players);
    }
}

export const rooms = new Map<string, Room>();
