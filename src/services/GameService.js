import ArrowService from './ArrowService'
import TileService from './TileService'

export default class GameService {
  constructor () {
    this.game = window.game

    this.nextPick = this.nextPick.bind(this)

    this.removedTiles = []

    this.tileService = new TileService()
    this.arrowService = new ArrowService()

    this.game.input.onDown.add(this.onPress, this)
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
