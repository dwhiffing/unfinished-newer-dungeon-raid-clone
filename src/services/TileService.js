import Enemy from '../sprites/Enemy'

const NUM_FRAMES = 5

// Responsible for:
// Creating and managing tiles
// Relates to: MatchService

export default class TileService {
  constructor (game, x, y) {
    this.game = game
    this.group = this.game.add.group()
    this.group.position.setTo(x, y)
    this.allTiles = []

    while (this.allTiles.length < 100) {
      this._createTile()
    }
  }

  init (data) {
    this._setupGrid(data)
  }

  getTile (position) {
    if (this.group.getBounds().contains(position.x, position.y)) {
      const _x = (position.x - this.group.x) / window.tileSize
      const _y = (position.y - this.group.y) / window.tileSize
      const dx = _x - Math.floor(Math.abs(_x))
      const dy = _y - Math.floor(Math.abs(_y))
      if (dx < 0.8 && dy < 0.8) {
        const x = Math.floor(_x)
        const y = Math.floor(_y)
        const index = x + y * window.gridDim
        return this.tiles[index]
      }
    }
  }

  destroyTile (index) {
    const tile = this.tiles[index]
    tile.destroy()
    this.tiles[index] = null
    return tile
  }

  applyGravity (match) {
    this.match = match
    this.matchIndex = 0

    for (let index = this.tiles.length - 1; index >= 0; index--) {
      this._applyGravityToIndex(
        index,
        this._holesAtIndex(index + window.gridDim)
      )
    }

    this.enemiesBeforeFall = this.tiles.filter(t => t && t.frame === 0)

    if (this.tiles.filter(t => t == null).length > 0) {
      return this._placeNewTiles()
    } else {
      return new Promise(resolve => resolve(this.enemiesBeforeFall))
    }
  }

  save () {
    localStorage.setItem('tile', JSON.stringify(this.tiles.map(t => t.frame)))
  }

  _applyGravityToIndex (index, holes) {
    const tile = this.tiles[index]
    if (holes > 0 && tile) {
      this.tiles[index] = null
      tile.fall(index + window.gridDim * holes, holes)
      this.tiles[tile.index] = tile
    }
  }

  _placeNewTiles () {
    return new Promise(resolve => {
      for (let column = 0; column < window.gridDim; column++) {
        const holes = this._holesAtIndex(column)
        for (let row = window.gridDim - 1; row >= 0; row--) {
          const index = row * window.gridDim + column
          if (this._holesAtIndex(index) > 0) {
            this._placeTile(index, holes, resolve)
          }
        }
      }
    })
  }

  _placeTile (index, holes, resolve) {
    const tile = this.allTiles.find(t => !t.visible)
    const frame = this._getRandomType()
    this.tiles[index] = tile
    tile.respawn(index, frame, holes).then(() => {
      const match = this.match.filter(t => t.frame !== 0 || t.hp <= 0)
      if (this.matchIndex === match.length - 1) {
        resolve(this.enemiesBeforeFall)
      }
      this.matchIndex++
    })
  }

  _holesAtIndex (_index) {
    let result = 0
    for (
      let index = _index;
      index < this.tiles.length;
      index += window.gridDim
    ) {
      if (this.tiles[index] == null) {
        result++
      }
    }
    return result
  }

  _setupGrid (data) {
    this.tiles = []
    this.allTiles
      .slice(0, window.gridDim * window.gridDim)
      .forEach((tile, index) => {
        const randomType = this._getRandomType() + 1
        let frame =
          data && typeof data[index] === 'number' ? data[index] : randomType
        if (frame > NUM_FRAMES - 1) {
          frame = NUM_FRAMES - 1
        }
        tile.reset(index, frame)
        this.tiles[index] = tile
      })
  }

  _createTile () {
    const tile = new Enemy(this.game)
    this.allTiles.push(tile)
    this.group.add(tile)

    return tile
  }

  _getRandomType () {
    return Math.floor(Math.random() * NUM_FRAMES)
  }
}
