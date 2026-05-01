import { type Socket } from "socket.io";
import { Room, rooms } from "../data/room.js";
import { Player } from "../data/player.js";
import { BodyRoomJoin, BodyRoomUpdate } from "@shared/requestBody.js"

export function socketListenning(socket: Socket) {
    socket.on('room/join', (body: BodyRoomJoin) => {
        const player = new Player(socket.id, body.playerName);
        let room = rooms.get(body.roomId);

        if (room == null) {
            room = new Room(body.roomId, player)
            rooms.set(body.roomId, room);
        }
        else {
            // Check if player isn't already in room
            for (const p of room.players) {
                if (p.id == player.id) {
                    return;
                }
            }
            room.players.push(player);
        }

        // Add current room to listen field
        socket.join(room.id);

        const bodyRoomUpdate: BodyRoomUpdate = {
            roomId: room.id,
            players: room.players.map((p) => p.nickname),
            spectators: [],
        };
        socket.to(room.id).emit('room/update', bodyRoomUpdate);
        socket.emit('room/update', {...bodyRoomUpdate, isAdmin: room.isAdmin(player)});
    });

    socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
            for (const player of room.players) {
                room.players = room.players.filter(p => p.id !== socket.id);

                if (room.players.length === 0) {
                    rooms.delete(roomId);
                } else {
                    const bodyRoomUpdate: BodyRoomUpdate = {
                        roomId: room.id,
                        players: room.players.map((p) => p.nickname),
                        spectators: [],
                    };
                    socket.to(room.id).emit('room/update', bodyRoomUpdate);
                    if (room.isAdmin(player)) {
                        room.adminId = room.players[0].id;
                        socket.to(room.adminId).emit('room/update', {...bodyRoomUpdate, isAdmin: true});
                    }
                }
            }
        });
    });
}
