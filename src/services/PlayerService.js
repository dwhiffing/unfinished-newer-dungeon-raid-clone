export default class PlayerService {
  constructor (gameService) {
    this.game = window.game

    this.uiService = gameService.uiService

    this.gold = 0
    this.armor = 0
    this.health = 20
  }

  updateResources (tiles) {
    tiles.forEach(tile => {
      if (tile.frame === 4) {
        this.gold++
      } else if (tile.frame === 3) {
        this.health++
      } else if (tile.frame === 2) {
        this.armor++
      }
    })

    this.uiService.update({
      gold: this.gold,
      armor: this.armor,
      health: this.health
    })
  }
}
