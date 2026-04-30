/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Lobby.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/29 11:05:43 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/30 23:05:19 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './Lobby.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { renderPlayer } from '../../gameRoom/render/render';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { initRoom } from '../../gameRoom/logic/roomSlice';
import { useEffect } from 'react';

type LobbyState = {
  mode?: 'multi'
  playerName?: string
  room?: string
}

export default function Lobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LobbyState | undefined) || undefined;

  // Get room from store
  const room = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch();

  useEffect(() => {
      // socket.on("connect", () => {
      //   console.log(`Client connected with id : ${socket.id}`);
      // });

      // Init game at page start
      dispatch(initRoom({
        id: 4
      }));
    }, [dispatch]);


  // Style define
  const roomStyle = {
    '--player-background' : '#646464',
    '--player-color' : '#EEEEEE',
  } as React.CSSProperties;

  return (
    <main className="page dev-page">
      <h1>Lobby</h1>
      <p>{state?.room ? `Room: ${state.room}` : ''} - {state?.playerName ? `${state.playerName}` : 'Multi player lobby'}</p>

      <div className='room-info' style={roomStyle}>
        <div className='player-list'>
          <h3>Players</h3>
          {room.players.map((player) => (
            renderPlayer(player)
          ))}
        </div>
        <div className='player-list'>
          <h3>Spectator</h3>
          {room.spectators.map((player) => (
            renderPlayer(player)
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/game', { state: { mode: 'multi', playerName: state?.playerName, room: state?.room } })}
      >
        Join game
      </button>
    </main>
  )
}
