/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/26 21:23:28 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/26 22:21:17 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'

function sanitizeSegment(value: string) {
  return value.trim().replaceAll('/', '').replaceAll(' ', '-')
}


/* Fonction qui va servire de Router pour l'url. Elle va recupérer 
l'id de la room et le playerName pour les setups pour la Game */
function Welcome() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('')
  const [room, setRoom] = useState('')

  const cleanPlayer = useMemo(() => sanitizeSegment(playerName), [playerName])
  const cleanRoom = useMemo(() => sanitizeSegment(room), [room])

  function go(targetRoom: string) {
    const r = sanitizeSegment(targetRoom)
    const p = sanitizeSegment(playerName)

    if (!r || !p) return

    navigate(`/${encodeURIComponent(r)}/${encodeURIComponent(p)}`)
  }

  return (
    <main className="page">
      <h1>Red Tetris</h1>

      <section className="card">
        <label className="field">
          <span>Player name</span>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="lumugot"
            autoComplete="nickname"
          />
        </label>

        <label className="field">
          <span>Room (multi)</span>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="room42"
          />
        </label>

        <div className="actions">
          <button
            type="button"
            disabled={!cleanPlayer}
            onClick={() => go('solo')}
          >
            Play solo
          </button>

          <button
            type="button"
            disabled={!cleanPlayer || !cleanRoom}
            onClick={() => go(room)}
          >
            Play multi
          </button>
        </div>

        <p className="hint">
          URL format: <code>/{'{room}'}/{'{player}'}</code>
        </p>
      </section>
    </main>
  )
}

function Room() {
  const { room, playerName } = useParams()

  return (
    <main className="page">
      <h1>Room</h1>
      <p className="hint">
        room: <code>{room}</code> — player: <code>{playerName}</code>
      </p>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/:room/:playerName" element={<Room />} />
    </Routes>
  )
}