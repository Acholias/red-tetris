import type { Player } from "../data/player";

export function renderPlayer(
          player: Player,
          yourId?: number) {
  return (
    <div key={`player-${player.id}`} className={(player.id == yourId) ? "player-you" : "player-item"}>
      <p>{player.name}</p>
    </div>
  )
}
