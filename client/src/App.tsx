/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/26 21:23:28 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/30 13:27:56 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Routes, Route, useParams, useLocation } from 'react-router-dom'
import type { Location as RouterLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DevCredits from './page/DevCredits'
import Profile from './page/Profile'
import Spectator from './page/Spectator'
import Lobby from './page/Lobby'
import Game from './page/Game'
import Welcome from './page/Welcome'
import { isDevPlayerName, resolveAvatarForPlayer } from './components/profileIdentity'

type ThemeName = 'default' | '1' | '2' | '3' | '4' | '5'


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
