import { type Socket } from "socket.io";
import { Room, rooms } from "../data/room.js";
import { Player } from "../data/player.js";
import { BodyRoomJoin, BodyRoomLeave, BodyRoomPlayerMode, BodyRoomSettings, BodyRoomUpdate } from "@shared/requestBody.js"

export function socketListenning(socket: Socket) {
    socket.on('room/join', (body: BodyRoomJoin) => {
        const newPlayer = new Player(socket.id, body.playerName);
        let currentRoom = rooms.get(body.roomId);

        if (currentRoom == null) {
            currentRoom = new Room(body.roomId, newPlayer)
            rooms.set(body.roomId, currentRoom);
        }
        else {
            currentRoom.addPlayer(newPlayer);
        }

        // Add current currentRoom to listen field
        socket.join(currentRoom.id);

        const bodyAll: BodyRoomUpdate = {
            players: currentRoom.players.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
            spectators: currentRoom.spectators.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
        };
        socket.to(currentRoom.id).emit('room/update', bodyAll);

        const bodyNewPlayer: BodyRoomUpdate = {...bodyAll,
            isAdmin: currentRoom.isAdmin(newPlayer),
            isPlaying: currentRoom.isPlaying,
            allPieces: currentRoom.allPieces,
            malus: currentRoom.malus,
            size: currentRoom.size,
            gameSpeed: currentRoom.gameSpeed,
            yourId: newPlayer.idInRoom,
        };
        socket.emit('room/update', bodyNewPlayer);
    });

    socket.on('room/leave', (body: BodyRoomLeave) => {
        const currentRoom = rooms.get(body.roomId);
        if (currentRoom == null) return;

        const currentPlayer = currentRoom.getPlayerById(socket.id);
        if (currentPlayer == null) return;

        currentRoom.players = currentRoom.players.filter(p => p.id !== currentPlayer.id);

        // Add current currentRoom to listen field
        socket.leave(currentRoom.id);

        const bodyAll: BodyRoomUpdate = {
            players: currentRoom.players.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
            spectators: currentRoom.spectators.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
        };
        socket.to(currentRoom.id).emit('room/update', bodyAll);
        socket.emit('room/update', bodyAll);
    });

    socket.on('room/settings', (body: BodyRoomSettings) => {
        const currentRoom = rooms.get(body.roomId);
        if (currentRoom == null) return;

        const currentPlayer = currentRoom.getPlayerById(socket.id);
        if (currentPlayer == null || !currentRoom.isAdmin(currentPlayer)) return;

        if (body.allPieces != null) currentRoom.allPieces = body.allPieces;
        if (body.malus != null) currentRoom.malus = body.malus;
        if (body.size != null) {
            if (body.size.w < 5) body.size.w = 5;
            else if (body.size.w > 20) body.size.w = 20;
            if (body.size.h < 10) body.size.h = 10;
            else if (body.size.h > 30) body.size.h = 30;
            currentRoom.size = body.size;
        }
        if (body.gameSpeed != null) {
            if (body.gameSpeed < 0.1) body.gameSpeed = 0.1;
            else if (body.gameSpeed > 1) body.gameSpeed = 1;
            currentRoom.gameSpeed = body.gameSpeed;
        }

        const bodyAll: BodyRoomUpdate = {
            allPieces: (body.allPieces != null) ? currentRoom.allPieces : undefined,
            malus: (body.malus != null) ? currentRoom.malus : undefined,
            size: (body.size != null) ? currentRoom.size : undefined,
            gameSpeed: (body.gameSpeed != null) ? currentRoom.gameSpeed : undefined,
        };
        socket.to(currentRoom.id).emit('room/update', bodyAll);
        socket.emit('room/update', bodyAll);
    });

    socket.on('room/playerMode', (body: BodyRoomPlayerMode) => {
        const currentRoom = rooms.get(body.roomId);
        if (currentRoom == null) return;

        const currentPlayer = currentRoom.getPlayerById(socket.id);
        if (currentPlayer == null) return;

        if (body.spectate) {
            if (currentRoom.isPlayerSpectate(currentPlayer.id)) return;
            currentRoom.spectators.push(currentPlayer);
            currentRoom.players = currentRoom.players.filter(p => p.id !== currentPlayer.id);
        } else {
            if (!currentRoom.isPlayerSpectate(currentPlayer.id)) return;
            if (currentRoom.players.length >= 5) return ;
            currentRoom.players.push(currentPlayer);
            currentRoom.spectators = currentRoom.spectators.filter(p => p.id !== currentPlayer.id);
        }

        const bodyAll: BodyRoomUpdate = {
            players: currentRoom.players.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
            spectators: currentRoom.spectators.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
        };
        socket.to(currentRoom.id).emit('room/update', bodyAll);
        socket.emit('room/update', bodyAll);
    });

    socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
            for (const player of room.players) {
                room.players = room.players.filter(p => p.id !== socket.id);
                room.spectators = room.spectators.filter(p => p.id !== socket.id);

                if (room.players.length == 0 && room.spectators.length == 0) {
                    rooms.delete(roomId);
                } else {
                    const bodyRoomUpdate: BodyRoomUpdate = {
                        players: room.players.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
                        spectators: room.spectators.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
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
