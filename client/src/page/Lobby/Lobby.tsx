/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Lobby.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/29 11:05:43 by lumugot           #+#    #+#             */
/*   Updated: 2026/05/01 21:38:45 by gugus            ###   ########.fr       */
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

export default function Lobby() {
  const navigate = useNavigate();
  const { room: urlRoom, playerName: urlPlayer } = useParams();

  // Get room from store
  const room = useSelector((state: RootState) => state.room);
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

  // Style define
  const roomStyle = {
    '--player-background' : '#646464',
    '--you-background' : '#284169',
    '--player-color' : '#EEEEEE',
  } as React.CSSProperties;

  return (
    <main className="page dev-page">
      <h1>{`Lobby ${urlRoom}`}</h1>

      {room.isPlaying && <h2>In game</h2>}

      <h2>Game parameters</h2>
      <p>Game mode : {room.players.length == 1 ? 'solo' : 'multi'}</p>
      {room.isAdmin && <div>
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
        {/* All pieces */}
        <div>
          <label>All pieces :</label>
          <input
            type='checkbox'
            checked={room.allPieces}
            onChange={() => updateSettings('allPieces', !room.allPieces)}
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
        <p>Size : {`${room.size.w}x${room.size.h}`}</p>
        <p>Pieces : {room.allPieces ? 'all' : 'basic'}</p>
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
        onClick={() => navigate('/game', { state: { mode: 'multi', playerName: urlPlayer, room: urlRoom } })}
      >
        Start game
      </button>}
    </main>
  )
}
