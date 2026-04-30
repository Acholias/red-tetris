/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   DevCredits.tsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 07:47:09 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/30 14:24:53 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

type DevCard = {
  avatarSrc: string
  title: string
  description: string
}

const devCards: DevCard[] = [
  {
    avatarSrc: '/avatarsdevs/lumugot.png',
    title: "Titre pour definir le rôle sur le projet",
    description: 'description',
  },
  {
    avatarSrc: '/avatarsdevs/aderouba.png',
    title: "Titre pour definir le rôle sur le projet",
    description: 'description',
  },
]

export default function DevCredits() {
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
                  {item.description ? <p>{item.description}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}