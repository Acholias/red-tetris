import type { Player } from "../data/player";

export function renderPlayer(
          player: Player) {
  return (
    <div className="player-item">
      <p>{player.nickname}</p>
    </div>
  )
}
