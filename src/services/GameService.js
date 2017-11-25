import ArrowService from './ArrowService'
import TileService from './TileService'
import UIService from '../services/UIService'

export default class GameService {
  constructor (state) {
    this.game = window.game

    this.nextPick = this.nextPick.bind(this)

    this.removedTiles = []
    this.gold = 0
    this.armor = 0
    this.health = 20

    this.tileService = new TileService()
    this.arrowService = new ArrowService()

    this.game.input.onDown.add(this.onPress, this)

    this.UIService = new UIService(state)
  }

  onPress ({ position }) {
    this.visited = []
    const tile = this.tileService.pickTile(position)
    if (tile) {
      this.visited.push(tile.index)

      this.game.input.onDown.remove(this.onPress, this)
      this.game.input.onUp.add(this.onRelease, this)
      this.game.input.addMoveCallback(this.onMove, this)
    }
  }

  onMove ({ position }) {
    const tiles = this.tileService.pickTile(position, this.visited)
    const visitedTiles = this.visited.map(t => this.tileService.tiles[t])
    this.arrowService.updateArrow(visitedTiles)
    if (tiles) {
      this.visited.push(tiles[0].index)
    }
  }

  onRelease () {
    this.game.input.onUp.remove(this.onRelease, this)
    this.game.input.deleteMoveCallback(this.onMove, this)

    this.resolveVisited()
    this.removedTiles.forEach(tile => {
      if (tile.frame === 4) {
        this.gold++
      } else if (tile.frame === 3) {
        this.health++
      } else if (tile.frame === 2) {
        this.armor++
      }
    })
    this.UIService.update({
      gold: this.gold,
      armor: this.armor,
      health: this.health
    })

    this.arrowService.clear()
    this.tileService.applyGravity(this.removedTiles, this.nextPick)
  }

  resolveVisited () {
    for (let i = 0; i < this.visited.length; i++) {
      if (this.visited.length > 2) {
        const tile = this.tileService.removeTile(this.visited[i])
        this.removedTiles.push(tile)
      } else {
        this.tileService.clearPick()
        this.nextPick()
      }
    }
  }

  nextPick () {
    if (!this.game.input.onDown.has(this.onPress, this)) {
      this.game.input.onDown.add(this.onPress, this)
    }
  }
}
