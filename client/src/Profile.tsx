/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 11:31:47 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/28 12:03:13 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={() => navigate(-1)}>×</button>
        <h1>Profile</h1>
        <p className="muted">Avatar custom.</p>
        <p className="muted">Themes pour le jeu.</p>
        <p className="muted">PlayerName.</p>
      </div>
    </div>
  )
}