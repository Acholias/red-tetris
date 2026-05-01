import { Player } from "./player.js";

export class Room {
    id: string;
    adminId: string;
    players: Player[];

    constructor(id: string, player: Player) {
        this.id = id;
        this.adminId = player.id;
        this.players = [player];
    }

    isAdmin(player: Player): boolean {
        return player.id === this.adminId;
    }
}

export const rooms = new Map<string, Room>();
