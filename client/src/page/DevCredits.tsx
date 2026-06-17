/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   DevCredits.tsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 07:47:09 by lumugot           #+#    #+#             */
/*   Updated: 2026/06/17 12:01:45 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useLocation, useNavigate } from 'react-router-dom'

type DevCard = {
  avatarSrc: string
  title: string
  description: string
}

const devCards: DevCard[] = [
  {
    avatarSrc: '/avatarsdevs/lumugot.png',
    title: "Designer",
    description: 'Creation of the project pages design',
  },
  {
    avatarSrc: '/avatarsdevs/aderouba.png',
    title: "Game Creator",
    description: 'Creation of the game engine and rules',
  },
]

export default function DevCredits() {
  const navigate = useNavigate();

  return (
    <main className="page devs-page">
      <h1>developers</h1>

      <section className="devs-shell" aria-label="Developers">
        <div className="devs-board">
          <div className="devs-grid">
            {devCards.map((item, i) => (
              <article key={i} className="devs-card" aria-label={`Developer ${i + 1}`}>
                <div className="devs-avatar">
                  <img src={item.avatarSrc} alt="" loading="lazy" />
                </div>

                <div className="devs-text">
                  <h2>{item.title}</h2>
                  {<p>{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
        <button className="button" onClick={() => navigate('../')}>Home page</button>
    </main>
  )
}
