/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/26 21:23:28 by lumugot           #+#    #+#             */
/*   Updated: 2026/05/05 10:01:45 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Routes, Route, useLocation } from 'react-router-dom';
import type { Location as RouterLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DevCredits from './page/DevCredits/DevCredits';
import Profile from './page/Profile/Profile';
import Spectator from './page/Spectator/Spectator';
import Lobby from './page/Lobby/Lobby';
import Game from './page/Game/Game';
import Welcome from './page/Welcome/Welcome';
import { isDevPlayerName, resolveAvatarForPlayer } from './components/profileIdentity';
import { useDispatch } from 'react-redux';

type ThemeName = 'default' | '1' | '2' | '3' | '4' | '5'

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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({'type': 'socket/connect'});
  }, [dispatch]);

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
        <Route path="/:room/:playerName" element={<Lobby />} />
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
