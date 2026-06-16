/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 11:31:47 by lumugot           #+#    #+#             */
/*   Updated: 2026/06/17 00:10:30 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isDevPlayerName, resolveAvatarForPlayer } from '../components/profileIdentity'

type ThemeName = 'default' | '1' | '2' | '3' | '4' | '5'

type ProfileProps = {
  playerName: string
  setPlayerName: React.Dispatch<React.SetStateAction<string>>
  avatar: string | null
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>
  theme: ThemeName
  setTheme: React.Dispatch<React.SetStateAction<ThemeName>>
}

const themes = [
  { value: 'default', label: 'Default', dot: 'linear-gradient(135deg, #41B9E1, #4169E1)' },
  { value: '1', label: '1', dot: 'linear-gradient(135deg, #99F6FF, #57B6FF)' },
  { value: '2', label: '2', dot: 'linear-gradient(135deg, #00FFA3, #00B3FF)' },
  { value: '3', label: '3', dot: 'linear-gradient(135deg, #fdb145, #FF5F6D)' },
  { value: '4', label: '4', dot: 'linear-gradient(135deg, #0EA5E9, #1D4ED8)' },
  { value: '5', label: '5', dot: 'linear-gradient(135deg, #5e8659, #3cff00)' },
]

export default function Profile({ playerName, setPlayerName, avatar, setAvatar, theme, setTheme }: ProfileProps) {
  const navigate = useNavigate()
  const [draftPlayerName, setDraftPlayerName] = useState(playerName)
  const [draftTheme, setDraftTheme] = useState(theme)
  const [draftAvatar, setDraftAvatar] = useState<string | null>(avatar)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    console.log('Profile mounted')
    return () => console.log('Profile unmounted')
  }, [])

  useEffect(() => {
    setDraftPlayerName(playerName)
    setDraftTheme(theme)
    setDraftAvatar(avatar)
  }, [playerName, theme, avatar])

  const [avatarOptions, setAvatarOptions] = useState<string[]>([])
  const [showAvatarOptions, setShowAvatarOptions] = useState(false)
  const previewAvatar = resolveAvatarForPlayer(draftPlayerName, draftAvatar)

  useEffect(() => {
    async function loadAvatars() {
      try {
        const res = await fetch('/avatars/list.json')
        if (res.ok) {
          const list = await res.json()
          if (Array.isArray(list) && list.length > 0) {
            setAvatarOptions(list.map((n: string) => `/avatars/${n}`))
            return
          }
        }
      } catch (err) {}
      const defaults = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png']
      setAvatarOptions(defaults.map((n) => `/avatars/${n}`))
    }
    loadAvatars()
  }, [])

  function removeAvatar() {
    setDraftAvatar(null)
  }

  function applyChanges() {
    const maxAge = 60 * 60 * 24 * 30
    try {
      setPlayerName(draftPlayerName)
      setTheme(draftTheme)
      setAvatar(draftAvatar)

      document.cookie = `playerName=${encodeURIComponent(draftPlayerName)}; max-age=${maxAge}; path=/`
      document.cookie = `theme=${encodeURIComponent(draftTheme)}; max-age=${maxAge}; path=/`
      if (draftAvatar) {
        try { localStorage.setItem('avatar', draftAvatar) } catch {}
      } else {
        try { localStorage.removeItem('avatar') } catch {}
      }
      setSuccessMessage('Profile updated successfully')
    } catch (err) {
      console.error('Failed to apply profile changes', err)
    }
  }

  useEffect(() => {
    if (!successMessage) return
    const timer = window.setTimeout(() => setSuccessMessage(''), 2200)
    return () => window.clearTimeout(timer)
  }, [successMessage])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="modal-overlay" onClick={() => { navigate(-1) }}>
      <div className="modal-card profile-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={() => navigate(-1)}>
          X
        </button>

        {successMessage && (
          <div className="profile-toast" role="status" aria-live="polite">
            <span className="profile-toast-dot" />
            <span>{successMessage}</span>
          </div>
        )}

        <h1 className="profile-title">Profile Page</h1>

        <div className="profile-grid">
          <section className="profile-avatar-block">
            <div className="avatar-stack">
              <div className="avatar-wrap">
                <div className="avatar-circle">
                  {previewAvatar ? <img src={previewAvatar} alt="Avatar preview" /> : <span>No avatar</span>}
                </div>

                <button
                  type="button"
                  className="avatar-gear"
                  aria-label="Open avatar list"
                  onClick={() => setShowAvatarOptions((s) => !s)}>
                  ⚙
                </button>

                {showAvatarOptions && (
                  <div className="avatar-options-popover">
                    {avatarOptions.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`avatar-option ${draftAvatar === url ? 'is-selected' : ''}`}
                        onClick={() => {
                          setDraftAvatar(url)
                          setShowAvatarOptions(false)
                        }}>
                        <img src={url} alt={`Avatar ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="avatar-actions">
                <button type="button" className="avatar-action avatar-remove-btn" onClick={removeAvatar}>
                  Remove photo
                </button>

                <button type="button" className="avatar-action avatar-apply-btn" onClick={applyChanges}>
                  Apply changes
                </button>
              </div>
            </div>
          </section>

        <section className="profile-theme-block">
          <div className="theme-panel">
            <span className="theme-panel-title">Theme</span>
        
            <div className="theme-list">
              {themes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`theme-item ${draftTheme === item.value ? 'is-active' : ''}`}
                  onClick={() => setDraftTheme(item.value as ThemeName)}>
                  <span
                    className="theme-dot"
                    style={{ background: item.dot }} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

          <section className="profile-name-block">
            <label className="field">
              <span>  PlayerName </span>
              <input
                className={isDevPlayerName(draftPlayerName) ? 'dev-name-input dev-name-input--gold' : ''}
                value={draftPlayerName}
                onChange={(e) => setDraftPlayerName(e.target.value)}
                placeholder="PlayerName"
                autoComplete="nickname"/>

            </label>
          </section>
        </div>
      </div>
    </div>
  )
}