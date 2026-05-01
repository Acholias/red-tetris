export interface BodyRoomJoin {
    roomId: string,
    playerName: string,
};

export interface BodyRoomUpdate {
    roomId: string,
    isAdmin?: boolean,
    players: string[],
    spectators: string[],
};
