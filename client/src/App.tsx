/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/26 21:23:28 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/29 11:41:49 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import type { Location as RouterLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { TetrisRain } from './components/TetrisRain'
import DevCredits from './DevCredits'
import Profile from './Profile'
import Spectator from './Spectator'
import Lobby from './Lobby'
import Game from './Game'
import { isDevPlayerName, resolveAvatarForPlayer } from './profileIdentity'

function sanitizeSegment(value: string) {
  return value.trim().replaceAll('/', '').replaceAll(' ', '-')
}

type ThemeName = 'default' | '1' | '2' | '3' | '4' | '5'

type WelcomeProps = {
  playerName: string
  setPlayerName: React.Dispatch<React.SetStateAction<string>>
  avatar: string | null
  isDevProfile: boolean
}

function Welcome({ playerName, setPlayerName, avatar, isDevProfile }: WelcomeProps) {
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
        type="button"
        className={`floating-btn profile-button ${avatar ? 'profile-avatar-button' : ''} ${isDevProfile ? 'is-dev-profile' : ''}`}
        onClick={() => navigate('/profile', { state: { backgroundLocation: location } })}
        aria-label="Open profile"
      >
        {avatar ? <img className="profile-avatar-image" src={avatar} alt="Current avatar" /> : 'Profile'}
      </button>
      <button className="floating-btn dev-button" onClick={() => navigate('/dev')}>Devs</button>
      <TetrisRain />
      <h1>Blue Tetris</h1>

      <section className="card">
        <label className="field">
          <span>Player name</span>
          <input
            className={isDevProfile ? 'dev-name-input dev-name-input--gold' : ''}
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
            onClick={() => navigate('/game', { state: { mode: 'solo', playerName } })}
          >
            Play solo
          </button>

          <button
            type="button"
            disabled={!cleanPlayer || !cleanRoom}
            onClick={() => navigate('/lobby', { state: { mode: 'multi', playerName, room } })}
          > 
            Play multi
          </button>

            <button
              type="button"
              disabled={!cleanPlayer || !cleanRoom}
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
  const isDevProfile = isDevPlayerName(playerName || '')

  return (
    <main className="page">
      <h1>Room</h1>
      <p className="hint">
        room: <code>{room}</code> — player: <span className={isDevProfile ? 'dev-name-text' : ''}>{playerName}</span>
      </p>
      {isDevProfile && <p className="hint dev-hint">Dev profile detected</p>}
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const state = (location.state as { backgroundLocation?: RouterLocation } | undefined) || undefined
  const background = state?.backgroundLocation
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('playerName') || '')
  const [avatar, setAvatar] = useState<string | null>(() => localStorage.getItem('avatar'))
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === '1' || saved === '2' || saved === '3' || saved === '4' || saved === '5' || saved === 'default') return saved
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

  const isDevProfile = isDevPlayerName(playerName)
  const displayedAvatar = resolveAvatarForPlayer(playerName, avatar)

  useEffect(() => {
    if (avatar) {
      try { localStorage.setItem('avatar', avatar) } catch {}
    } else {
      try { localStorage.removeItem('avatar') } catch {}
    }
  }, [avatar])

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Welcome playerName={playerName} setPlayerName={setPlayerName} avatar={displayedAvatar} isDevProfile={isDevProfile} />} />
        <Route path="/dev" element={<DevCredits />} />
        <Route path="/spectator" element={<Spectator />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
        <Route
          path="/profile"
          element={
            <Profile
              playerName={playerName}
              setPlayerName={setPlayerName}
              avatar={avatar}
              setAvatar={setAvatar}
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
                avatar={avatar}
                setAvatar={setAvatar}
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