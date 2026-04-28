/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/26 21:23:28 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/28 17:00:20 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import type { Location as RouterLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { TetrisRain } from './components/TetrisRain'
import DevCredits from './DevCredits'
import Profile from './Profile'
import Spectator from './Spectator'

function sanitizeSegment(value: string) {
  return value.trim().replaceAll('/', '').replaceAll(' ', '-')
}

type ThemeName = 'default' | 'ice' | 'neon'

type WelcomeProps = {
  playerName: string
  setPlayerName: React.Dispatch<React.SetStateAction<string>>
}

function Welcome({ playerName, setPlayerName }: WelcomeProps) {
  const navigate = useNavigate()
  const location = useLocation()
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
  className="floating-btn profile-button"
    onClick={() => navigate('/profile', { state: { backgroundLocation: location } })}>Profile</button>
      <button className="floating-btn dev-button" onClick={() => navigate('/dev')}>Devs</button>
      {/* <TetrisRain /> */}
      <h1>Blue Tetris</h1>

      <section className="card">
        <label className="field">
          <span>Player name</span>
          <input
            value={playerName}
            onChange={(e) => {
              console.log('Welcome: player input', e.target.value)
              setPlayerName(e.target.value)
            }}
            placeholder="PlayerName"
            autoComplete="nickname"
          />
        </label>

        <label className="field">
          <span>Room</span>
          <input
            value={room}
            onChange={(e) => {
              console.log('Welcome: room input', e.target.value)
              setRoom(e.target.value)
            }}
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
              onClick={() => navigate('/spectator')}
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
  const state = (location.state as { backgroundLocation?: RouterLocation } | undefined) || undefined
  const background = state?.backgroundLocation
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('playerName') || '')
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'ice' || saved === 'neon' || saved === 'default') return saved
    return 'default'
  })

  useEffect(() => {
    console.log('App: playerName changed', playerName)
    try { localStorage.setItem('playerName', playerName) } catch {}
  }, [playerName])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Welcome playerName={playerName} setPlayerName={setPlayerName} />} />
        <Route path="/dev" element={<DevCredits />} />
        <Route path="/spectator" element={<Spectator />} />
        <Route
          path="/profile"
          element={
            <Profile
              playerName={playerName}
              setPlayerName={setPlayerName}
              theme={theme}
              setTheme={setTheme}
            />
          }
        />
        <Route path="/:room/:playerName" element={<Room />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/profile"
            element={
              <Profile
                playerName={playerName}
                setPlayerName={setPlayerName}
                theme={theme}
                setTheme={setTheme}
              />
            }
          />
        </Routes>
      )}
    </>
  )
}