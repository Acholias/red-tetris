/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 11:31:47 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/28 15:59:32 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type ThemeName = 'default' | 'ice' | 'neon'

type ProfileProps = {
  playerName: string
  setPlayerName: React.Dispatch<React.SetStateAction<string>>
  theme: ThemeName
  setTheme: React.Dispatch<React.SetStateAction<ThemeName>>
}

const themes = [
  { value: 'Default', label: 'Default', dot: 'linear-gradient(135deg, #41B9E1, #4169E1)' },
  { value: 'Ice', label: 'Ice', dot: 'linear-gradient(135deg, #99F6FF, #57B6FF)' },
  { value: 'Neon', label: 'Neon', dot: 'linear-gradient(135deg, #00FFA3, #00B3FF)' },
  { value: 'Retro', label: 'Retro', dot: 'linear-gradient(135deg, #fdb145, #FF5F6D)' },
  { value: 'Ocean', label: 'Ocean', dot: 'linear-gradient(135deg, #0EA5E9, #1D4ED8)' },
  { value: 'test', label: 'test', dot: 'linear-gradient(135deg, #5e8659, #3cff00)' },
]

export default function Profile({ playerName, setPlayerName, theme, setTheme }: ProfileProps) {
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('avatar')
    if (saved) setAvatar(saved)
  }, [])

  useEffect(() => {
    console.log('Profile mounted')
    return () => console.log('Profile unmounted')
  }, [])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 256
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          setAvatar(dataUrl)
            try { localStorage.setItem('avatar', dataUrl) } catch { }
          } catch (err) {
          const value = reader.result as string
          setAvatar(value)
          try { localStorage.setItem('avatar', value) } catch { }
        }
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  function removeAvatar() {
    setAvatar(null)
    try { localStorage.removeItem('avatar') } catch {}
  }

  return (
    <div className="modal-overlay" onClick={() => { navigate(-1) }}>
      <div className="modal-card profile-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={() => navigate(-1)}>
          X
        </button>

        <h1 className="profile-title">Profile Page</h1>

        <div className="profile-grid">
          <section className="profile-avatar-block">
            <div className="avatar-circle">
              {avatar ? <img src={avatar} alt="Avatar preview" /> : <span>No avatar</span>}
            </div>

            <label className="avatar-upload-label" htmlFor="avatar-input">
              Update photo
            </label>
            <input
              id="avatar-input"
              className="avatar-file-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange} />
            <button type="button" className="avatar-remove-btn" onClick={removeAvatar}>
              Remove photo
            </button>
          </section>

        <section className="profile-theme-block">
          <div className="theme-panel">
            <span className="theme-panel-title">Theme</span>
        
            <div className="theme-list">
              {themes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`theme-item ${theme === item.value ? 'is-active' : ''}`}
                  onClick={() => setTheme(item.value as ThemeName)}>
                  <span
                    className="theme-dot"
                    style={{ background: item.dot }} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
            
          <p className="muted">Choisis le theme global du site.</p>
        </section>

          <section className="profile-name-block">
            <label className="field">
              <span>PlayerName</span>
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="PlayerName"
                autoComplete="nickname"/>

            </label>
          </section>
        </div>
      </div>
    </div>
  )
}