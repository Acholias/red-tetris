/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 08:30:53 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/28 10:28:06 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React from "react";
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={() => navigate(-1)}>
          X
        </button>

        <h1>Profile</h1>
        <p>Ton contenu ici.</p>
      </div>
    </div>
  )
}