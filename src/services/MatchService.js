// Responsible for:
// handling matches from user input using TileService
// Relates to: TileService

export default class MatchService {
  constructor (game) {
    this.game = game
    this.path = []
    this.match = []
  }

  init (tiles) {
    this.tiles = tiles
  }

  selectTile (tile) {
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
      this.path.forEach(t => this.tiles[t].unpick())
      return false
    }

    for (let i = 0; i < this.path.length; i++) {
      const tile = this.tiles[this.path[i]]
      this.match.push(tile)
    }

    return this.clearPath()
  }

  clearPath () {
    const match = this.match.concat([])
    this.path = []
    this.match = []
    this.tiles.forEach(t => {
      t.alpha = 1
    })

    return match
  }

  getTilesInMatch () {
    return this.path.map(t => this.tiles[t])
  }

  getDyingEnemies (damage, tiles = this.getTilesInMatch()) {
    return tiles.filter(t => t.frame === 0 && t.armor + t.hp - damage <= 0)
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
    return this.tiles[this.path[this.path.length - n]]
  }

  _highlightMatchingTiles (frame) {
    this.tiles.forEach(t => {
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
      this._checkAdjacent(tile.coordinate, last.coordinate) &&
      (tile.frame === last.frame || (tile.frame < 2 && last.frame < 2))
    )
  }

  _checkAdjacent (p1, p2) {
    return Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1
  }
}
