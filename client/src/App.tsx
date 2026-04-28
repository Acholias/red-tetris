/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/26 21:23:28 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/28 12:27:12 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { TetrisRain } from './components/TetrisRain'
import DevCredits from './DevCredits'
import Profile from './Profile'

function sanitizeSegment(value: string) {
  return value.trim().replaceAll('/', '').replaceAll(' ', '-')
}


function Welcome() {
  const navigate = useNavigate()
  const location = useLocation()
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
<button
  className="floating-btn dev-button"
    onClick={() => navigate('/profile', { state: { backgroundLocation: location , playerName} })}>Profile</button>
      <button className="floating-btn profile-button" onClick={() => navigate('/dev')}>Devs</button>
      <TetrisRain />
      <h1>Blue Tetris</h1>

      <section className="card">
        <label className="field">
          <span>Player name</span>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="PlayerName"
            autoComplete="nickname"
          />
        </label>

        <label className="field">
          <span>Room</span>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="42"
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

            <button
              type="button"
              disabled={!cleanPlayer}
              onClick={() => go('spectator')}
              className="spectator-btn">
              Spectator
          </button>
        </div>
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
  const location = useLocation()
  const state = (location.state as { backgroundLocation?: Location }) || undefined
  const background = state?.backgroundLocation

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Welcome />} />
        <Route path="/dev" element={<DevCredits />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/:room/:playerName" element={<Room />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      )}
    </>
  )
}