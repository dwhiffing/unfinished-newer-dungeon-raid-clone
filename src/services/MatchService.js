export default class MatchService {
  constructor (gameService) {
    this.game = window.game
    this.tileService = gameService.tileService
    this.path = []
    this.match = []
  }

  selectTile (position) {
    const tile = this.tileService.getTile(position)
    if (!tile || this._checkForDeselect(tile) || tile.picked) {
      return
    }

    if (this.path.length === 0) {
      this._highlightMatchingTiles(tile.frame)
      this._select(tile)
      return tile
    }

    const last = this._getLast(1)
    if (this._isValidMatch(tile, last)) {
      this._select(tile)
      return [tile, last]
    }
  }

  resolveMatch () {
    if (this.path.length < 3) {
      this.path.forEach(t => this.tileService.tiles[t].unpick())
      return false
    }

    for (let i = 0; i < this.path.length; i++) {
      const tile = this.tileService.tiles[this.path[i]]
      this.match.push(tile)
    }

    return this.clearPath()
  }

  clearPath () {
    const match = this.match.concat([])
    this.path = []
    this.match = []
    this.tileService.tiles.forEach(t => {
      t.alpha = 1
    })

    return match
  }

  getTilesInMatch () {
    return this.path.map(t => this.tileService.tiles[t])
  }

  _select (tile) {
    tile.pick()
    this.path.push(tile.index)
  }

  _checkForDeselect (tile) {
    if (this._getLast(2) && tile.index === this._getLast(2).index) {
      this._getLast(1).unpick()
      this.path.pop()
      return true
    }
  }

  _getLast (n) {
    if (this.path.length < n) {
      return
    }
    return this.tileService.tiles[this.path[this.path.length - n]]
  }

  _highlightMatchingTiles (frame) {
    this.tileService.tiles.forEach(t => {
      if (frame === 0 || frame === 1) {
        if (t.frame > 1) {
          t.alpha = 0.5
        }
      } else if (t.frame !== frame) {
        t.alpha = 0.5
      }
    })
  }

  _isValidMatch (tile, last) {
    return (
      this.tileService._checkAdjacent(tile.coordinate, last.coordinate) &&
      (tile.frame === last.frame || (tile.frame < 2 && last.frame < 2))
    )
  }
}
