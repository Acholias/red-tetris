import type { Room } from '../data/room';

export function canYouPlay(room: Room): boolean {
    // Check if there are not too many player in play
    if (room.players.length >= 5) return false;

    // Check if your are already in play
    for (const player of room.players) {
        if (player.id == room.yourId) return false;
    }

    return true;
}

export function canYouSpectate(room: Room): boolean {
    // Check if your aren't already in spectate
    for (const player of room.spectators) {
        if (player.id == room.yourId) return false;
    }

    return true;
}
