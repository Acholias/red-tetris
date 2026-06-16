import { type Socket } from "socket.io";
import { Room, rooms } from "../room/room.js";
import { Player } from "../room/player.js";
import { BodyGameAction, BodyGameEnd, BodyGameSpectrum, BodyGameStarted, BodyGameUpdate, BodyRoomJoin, BodyRoomLeave, BodyRoomPlayerMode, BodyRoomSettings, BodyRoomStartGame, BodyRoomUpdate, BodyGameNextPiece, BodyGameMalus } from "@shared/requestBody"
import { server } from "../index.js";
import { maxGridHeight, maxGridWidth, maxSpeed, maxSpeedFrequency, maxSpeedRate, minGridHeight, minGridWidth, minSpeed, minSpeedFrequency, minSpeedRate } from "@shared/defines";

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

    socket.on('room/settings', (body: BodyRoomSettings) => {
        const currentRoom = rooms.get(body.roomId);
        if (currentRoom == null) return;

        const currentPlayer = currentRoom.getPlayerById(socket.id);
        if (currentPlayer == null ||
            !currentRoom.isAdmin(currentPlayer) ||
            currentRoom.isPlaying) {
            return;
        }

        if (body.allPieces != null) currentRoom.allPieces = body.allPieces;
        if (body.malus != null) currentRoom.malus = body.malus;
        if (body.size != null) {
            if (body.size.w < minGridWidth) body.size.w = minGridWidth;
            else if (body.size.w > maxGridWidth) body.size.w = maxGridWidth;
            if (body.size.h < minGridHeight) body.size.h = minGridHeight;
            else if (body.size.h > maxGridHeight) body.size.h = maxGridHeight;
            currentRoom.size = body.size;
        }
        if (body.gameSpeed != null) {
            if (body.gameSpeed.speed < minSpeed) body.gameSpeed.speed = minSpeed;
            else if (body.gameSpeed.speed > maxSpeed) body.gameSpeed.speed = maxSpeed;

            if (body.gameSpeed.frequency < minSpeedFrequency) body.gameSpeed.frequency = minSpeedFrequency;
            else if (body.gameSpeed.frequency > maxSpeedFrequency) body.gameSpeed.frequency = maxSpeedFrequency;

            if (body.gameSpeed.rate < minSpeedRate) body.gameSpeed.rate = minSpeedRate;
            else if (body.gameSpeed.rate > maxSpeedRate) body.gameSpeed.rate = maxSpeedRate;

            if (body.gameSpeed.max < body.gameSpeed.speed) body.gameSpeed.max = body.gameSpeed.speed;
            else if (body.gameSpeed.max > maxSpeed) body.gameSpeed.max = maxSpeed;

            currentRoom.gameSpeed = body.gameSpeed;
        }

        const bodyAll: BodyRoomUpdate = {
            allPieces: (body.allPieces != null) ? currentRoom.allPieces : undefined,
            malus: (body.malus != null) ? currentRoom.malus : undefined,
            size: (body.size != null) ? currentRoom.size : undefined,
            gameSpeed: (body.gameSpeed != null) ? currentRoom.gameSpeed : undefined,
        };
        server.sendSocketMessage(currentRoom.id, 'room/update', bodyAll);
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
        server.sendSocketMessage(currentRoom.id, 'room/update', bodyAll);
    });

    socket.on('room/startGame', (body: BodyRoomStartGame) => {
        const currentRoom = rooms.get(body.roomId);
        if (currentRoom == null || currentRoom.isPlaying) return;

        const currentPlayer = currentRoom.getPlayerById(socket.id);
        if (currentPlayer == null) return;
        if (!currentRoom.isAdmin(currentPlayer)) return;

        currentRoom.startGame();

        currentRoom.isPlaying = true;
        const bodyStartGame: BodyGameStarted = {
            allPieces: currentRoom.allPieces,
            malus: currentRoom.malus,
            size: currentRoom.size,
            gameSpeed: currentRoom.gameSpeed,
            pieceId: currentRoom.gamedata.pieces[0],
            nextPieceId: currentRoom.gamedata.pieces[1],
        };

        server.sendSocketMessage(currentRoom.id, 'room/gameStarted', bodyStartGame);
    });

    socket.on('game/action', (body: BodyGameAction) => {
        const currentRoom = rooms.get(body.roomId);
        if (currentRoom == null || !currentRoom.isPlaying) return;

        const currentPlayer = currentRoom.getPlayerById(socket.id);
        if (currentPlayer == null) return;

        const events = currentRoom.gamedata.playerAction(currentPlayer.id, body.action);

        for (const event of events) {
            if (event.type == 'update-grid') {
                const body: BodyGameUpdate = {
                    grid: event.grid!,
                    nextPiece: event.nextPiece
                };
                if (event.id == currentPlayer.id) {
                    socket.emit('room/gameUpdate', body);
                } else {
                    socket.to(event.id).emit('room/gameUpdate', body);
                }
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
                if (event.id == currentPlayer.id) {
                    socket.emit('room/nextPiece', body);
                } else {
                    socket.to(event.id).emit('room/nextPiece', body);
                }
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
                if (event.id == currentPlayer.id) {
                    socket.emit('room/gameEnd', body);
                } else {
                    socket.to(event.id).emit('room/gameEnd', body);
                }
            }
            else if (event.type == 'finished') {
                currentRoom.isPlaying = false;
                server.sendSocketMessage(currentRoom.id, 'room/gameFinished', {});
            }
        }
    });

    socket.on('room/leave', (body: BodyRoomLeave) => {
        const currentRoom = rooms.get(body.roomId);
        if (currentRoom == null) return;

        const currentPlayer = currentRoom.getPlayerById(socket.id);
        if (currentPlayer == null) return;

        // Remove current currentRoom to listen field
        socket.leave(currentRoom.id);

        // Delete room if it will be empty
        if (currentRoom.players.length + currentRoom.spectators.length == 1) {
            rooms.delete(currentRoom.id);
            return;
        }

        // If room is playing, check if someone win
        if (currentRoom.isPlaying) {
            const events = currentRoom.gamedata.removePlayer(socket.id);
            for (const event of events) {
                if (event.type == 'end') {
                    const body: BodyGameEnd = {
                        win: event.win!
                    };
                    socket.to(event.id).emit('room/gameEnd', body);
                }
                else if (event.type == 'finished') {
                    currentRoom.isPlaying = false;
                    server.sendSocketMessage(currentRoom.id, 'room/gameFinished', {});
                }
            }
        }

        // Remove player from players and spectators
        currentRoom.players = currentRoom.players.filter(p => p.id !== socket.id);
        currentRoom.spectators = currentRoom.spectators.filter(p => p.id !== socket.id);

        // Send new players and spectators
        const bodyRoomUpdate: BodyRoomUpdate = {
            players: currentRoom.players.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
            spectators: currentRoom.spectators.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
        };
        socket.to(currentRoom.id).emit('room/update', bodyRoomUpdate);

        // Change admin if needed
        if (currentRoom.adminId == socket.id) {
            if (currentRoom.players.length > 0) {
                currentRoom.adminId = currentRoom.players[0].id;
            } else {
                currentRoom.adminId = currentRoom.spectators[0].id;
            }
            socket.to(currentRoom.adminId).emit('room/update', {...bodyRoomUpdate, isAdmin: true});
        }
    });

    socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
            // Check if the player is in the room
            if (room.getPlayerById(socket.id) == null) return;

            // Delete room if it will be empty
            if (room.players.length + room.spectators.length == 1) {
                rooms.delete(roomId);
                return;
            }

            // If room is playing, check if someone win
            if (room.isPlaying) {
                const events = room.gamedata.removePlayer(socket.id);
                for (const event of events) {
                    if (event.type == 'end') {
                        const body: BodyGameEnd = {
                            win: event.win!
                        };
                        socket.to(event.id).emit('room/gameEnd', body);
                    }
                    else if (event.type == 'finished') {
                        room.isPlaying = false;
                        server.sendSocketMessage(room.id, 'room/gameFinished', {});
                    }
                }
            }

            // Remove player from players and spectators
            room.players = room.players.filter(p => p.id !== socket.id);
            room.spectators = room.spectators.filter(p => p.id !== socket.id);

            // Send new players and spectators
            const bodyRoomUpdate: BodyRoomUpdate = {
                players: room.players.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
                spectators: room.spectators.map((player) => {return {id: player.idInRoom??-1, name: player.name}}),
            };
            socket.to(room.id).emit('room/update', bodyRoomUpdate);

            // Change admin if needed
            if (room.adminId == socket.id) {
                if (room.players.length > 0) {
                    room.adminId = room.players[0].id;
                } else {
                    room.adminId = room.spectators[0].id;
                }
                socket.to(room.adminId).emit('room/update', {...bodyRoomUpdate, isAdmin: true});
            }
        });
    });
}