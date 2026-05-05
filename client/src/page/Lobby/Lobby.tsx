/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Lobby.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/29 11:05:43 by lumugot           #+#    #+#             */
/*   Updated: 2026/05/05 10:39:13 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './Lobby.css'
import { useNavigate, useParams } from 'react-router-dom';
import { renderPlayer } from '../../gameRoom/render/render';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { initRoom } from '../../gameRoom/logic/roomSlice';
import { useEffect } from 'react';
import { canYouPlay, canYouSpectate } from '../../gameRoom/utils/functions';
import { createRoomTheme } from '../../theme/theme';

export default function Lobby() {
    const navigate = useNavigate();
    const { room: urlRoom, playerName: urlPlayer } = useParams();

    // Get room and theme from store
    const room = useSelector((state: RootState) => state.room);
    const currentTheme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        if (room.isSocketConnected && room.id == '' && urlRoom != null && urlPlayer != null) {
        dispatch(initRoom({id: urlRoom, playerName: urlPlayer}));
        dispatch({'type': 'room/join', 'payload': {
            'roomId': urlRoom,
            'playerName': urlPlayer,
        }});
        }
    }, [dispatch, room.isSocketConnected, room.id]);

    useEffect(() => {
        if (!room.isPlaying) return;

        // Check if you are a player
        for (const player of room.players) {
        if (player.id == room.yourId) {
            navigate('/game');
            return;
        }
        }

        // Else, you are a spectator
        navigate('/spectator');
    }, [dispatch, room.isPlaying]);

    function updateSettings(key: string, value: any) {
        dispatch({
        'type' : 'room/settings',
        'payload' : {
            'roomId': urlRoom,
            [key] : value
        }
        });
    }
    function changePlayerMode(spectate: boolean) {
        dispatch({
        'type' : 'room/playerMode',
        'payload' : {
            'roomId': urlRoom,
            'spectate' : spectate,
        }
        });
    }
    function startGame() {
        dispatch({
        'type' : 'room/startGame',
        'payload' : {
            'roomId': urlRoom,
        }
        });
    }

    // Style define
    const roomStyle = createRoomTheme(currentTheme);

    return (
        <main className="page dev-page">
        <h1>{`Lobby ${urlRoom}`}</h1>

        {room.isPlaying && <h2>In game</h2>}

        <h2>Game parameters</h2>
        <p>Game mode : {room.players.length == 1 ? 'solo' : 'multi'}</p>
        {room.isAdmin && <div>
            {/* All pieces */}
            <div>
            <label>All pieces :</label>
            <input
                type='checkbox'
                checked={room.allPieces}
                onChange={() => updateSettings('allPieces', !room.allPieces)}
            />
            </div>
            {/* Malus */}
            <div>
            <label>Malus :</label>
            <input
                type='checkbox'
                checked={room.malus}
                onChange={() => updateSettings('malus', !room.malus)}
            />
            </div>
            {/* Size */}
            <div>
            <label>Width : </label>
            <input
                type="number"
                min={5}
                max={20}
                defaultValue={room.size.w}
                onBlur={(e) => updateSettings('size', {
                'w': parseFloat(e.target.value),
                'h': room.size.h,
                })}
            />
            <label>Height : </label>
            <input
                type="number"
                min={10}
                max={30}
                defaultValue={room.size.h}
                onBlur={(e) => updateSettings('size', {
                'w': room.size.w,
                'h': parseFloat(e.target.value),
                })}
            />
            </div>
            {/* Speed */}
            <div>
            <label>Speed (ticks/sec) : </label>
            <input
                type="number"
                min={1}
                max={10}
                defaultValue={1 / room.gameSpeed}
                onBlur={(e) => updateSettings('gameSpeed', 1 / parseFloat(e.target.value))}
            />
            </div>
        </div>}
        {!room.isAdmin && <div>
            <p>Pieces : {room.allPieces ? 'all' : 'basic'}</p>
            <p>Malus : {room.malus ? 'on' : 'off'}</p>
            <p>Size : {`${room.size.w}x${room.size.h}`}</p>
            <p>Speed: {room.gameSpeed != 0 ? `${1 / room.gameSpeed}` : '0 '} ticks per second</p>
        </div>}

        <div className='room-info' style={roomStyle}>
            <div className='player-list'>
            <h3>Players</h3>
            {room.players.map((player) => (
                renderPlayer(player, room.yourId)
            ))}
            </div>
            <div className='player-list'>
            <h3>Spectators</h3>
            {room.spectators.map((player) => (
                renderPlayer(player, room.yourId)
            ))}
            </div>
        </div>

        {canYouPlay(room) && <button
            type="button"
            onClick={() => {changePlayerMode(false)}}
        >
            Play
        </button>}
        {canYouSpectate(room) && <button
            type="button"
            onClick={() => {changePlayerMode(true)}}
        >
            Spectate
        </button>}
        {room.isAdmin && !room.isPlaying && room.players.length > 0 && <button
            type="button"
            onClick={() => startGame()}
        >
            Start game
        </button>}
        </main>
    )
}
