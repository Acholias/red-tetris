/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Lobby.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/29 11:05:43 by lumugot           #+#    #+#             */
/*   Updated: 2026/05/01 14:30:22 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './Lobby.css'
import { useNavigate, useParams } from 'react-router-dom';
import { renderPlayer } from '../../gameRoom/render/render';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { initRoom } from '../../gameRoom/logic/roomSlice';
import { useEffect } from 'react';

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

  // Style define
  const roomStyle = {
    '--player-background' : '#646464',
    '--player-color' : '#EEEEEE',
  } as React.CSSProperties;

  return (
    <main className="page dev-page">
      <h1>Lobby</h1>
      <p>{urlRoom ? `Room: ${urlRoom}` : ''} - {urlPlayer ? `${urlPlayer}` : ''} {room.isAdmin ? ' - Admin' : ''}</p>

      <div className='room-info' style={roomStyle}>
        <div className='player-list'>
          <h3>Players</h3>
          {room.players.map((player) => (
            renderPlayer(player)
          ))}
        </div>
        <div className='player-list'>
          <h3>Spectators</h3>
          {room.spectators.map((player) => (
            renderPlayer(player)
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/game', { state: { mode: 'multi', playerName: urlPlayer, room: urlRoom } })}
      >
        Join game
      </button>
    </main>
  )
}
