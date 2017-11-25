export default class MatchService {
  constructor (gameService) {
    this.game = window.game
    this.match = []
    this.path = []
    this.tileService = gameService.tileService
  }

  selectTile (position) {
    let last
    const tile = this.tileService.pickTile(position)

    // check for deselect
    if (this.path.length > 0) {
      last = this.tileService.tiles[this.path[this.path.length - 1]]
      const last2 = this.tileService.tiles[this.path[this.path.length - 2]]
      if (last2 && tile.index === last2.index) {
        last.unpick()
        this.path.pop()
        return
      }
    }

    if (!last || this._isValidMatch(tile, last)) {
      if (tile.picked) {
        return
      }
      tile.pick()
      this.path.push(tile.index)
      return last ? [tile, last] : tile
    }
  }

  resolveMatch () {
    if (this.path.length < 3) {
      this.tileService.clearPick()
      return false
    }

    for (let i = 0; i < this.path.length; i++) {
      const tile = this.tileService.removeTile(this.path[i])
      this.match.push(tile)
    }
    this.path = []
    return this.match
  }

  getTilesInMatch () {
    return this.path.map(t => this.tileService.tiles[t])
  }

  _isValidMatch (tile, last) {
    return (
      this.tileService._checkAdjacent(tile.coordinate, last.coordinate) &&
      tile.frame === last.frame
    )
  }
}
