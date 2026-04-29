/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Lobby.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/29 11:05:43 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/29 11:39:05 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type LobbyState = {
  mode?: 'multi'
  playerName?: string
  room?: string
}

export default function Lobby() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LobbyState | undefined) || undefined

  return (
    <main className="page dev-page">
      <h1>Lobby</h1>
      <p>{state?.playerName ? `Player: ${state.playerName}` : 'Multi player lobby'}</p>
      <p>{state?.room ? `Room: ${state.room}` : ''}</p>
      <button
        type="button"
        onClick={() => navigate('/game', { state: { mode: 'multi', playerName: state?.playerName, room: state?.room } })}
      >
        Join game
      </button>
    </main>
  )
}