import Enemy from '../sprites/Enemy'

const TILE_SIZE = 70
const GRID_SIZE = 6
const NUM_FRAMES = 5

export default class TileService {
  constructor () {
    this.game = window.game
    this.group = this.game.add.group()
    this.group.x = 0
    this.group.y = 125
    this.allTiles = []

    while (this.allTiles.length < 100) {
      this._createTile()
    }
  }

  init (gameService) {
    this.tiles = []

    this._setupGrid()
  }

  pickTile (position) {
    if (this.group.getBounds().contains(position.x, position.y)) {
      const _x = (position.x - this.group.x) / TILE_SIZE
      const _y = (position.y - this.group.y) / TILE_SIZE
      const dx = _x - Math.floor(Math.abs(_x))
      const dy = _y - Math.floor(Math.abs(_y))
      if (dx < 0.8 && dy < 0.8) {
        const x = Math.floor(_x)
        const y = Math.floor(_y)
        const index = x + y * GRID_SIZE
        return this.tiles[index]
      }
    }
  }

  clearPick () {
    this.tiles.forEach(t => t.unpick())
  }

  removeTile (index) {
    const tile = this.tiles[index]
    tile.destroy()
    this.tiles[index] = null
    return tile
  }

  applyGravity (match, callback) {
    this.match = match
    this.matchIndex = 0
    this.callback = callback
    for (let index = this.tiles.length - 1; index >= 0; index--) {
      const holes = this._holesAtIndex(index + GRID_SIZE)
      const tile = this.tiles[index]
      if (holes > 0 && tile) {
        this.tiles[index] = null
        tile.index = index + GRID_SIZE * holes
        this.tiles[tile.index] = tile
        tile.fall(holes)
      }
    }

    this._placeNewTiles()
  }

  _placeNewTiles () {
    for (let column = 0; column < GRID_SIZE; column++) {
      const holesInColumn = this._holesAtIndex(column)
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        const index = row * GRID_SIZE + column
        if (this._holesAtIndex(index) > 0) {
          const tile = this.allTiles.find(t => !t.visible)
          const frame = this._getRandomType()
          this.tiles[index] = tile.respawn(
            index,
            frame,
            holesInColumn,
            this.finishedPlacing.bind(this)
          )
        }
      }
    }
  }

  finishedPlacing () {
    this.matchIndex++
    if (this.matchIndex === this.match.length - 1) {
      this.callback()
    }
  }

  _createTile () {
    const tile = new Enemy({
      game: this.game,
      size: TILE_SIZE
    })

    this.allTiles.push(tile)
    this.group.add(tile)

    return tile
  }

  _setupGrid () {
    this.tiles = []

    this.allTiles.slice(0, GRID_SIZE * GRID_SIZE).forEach((tile, index) => {
      let frame = this._getRandomType() + 1
      if (frame > NUM_FRAMES - 1) {
        frame = NUM_FRAMES - 1
      }
      tile.reset(index, frame)
      this.tiles[index] = tile
    })
  }

  _holesAtIndex (_index) {
    let result = 0
    for (let index = _index; index < this.tiles.length; index += GRID_SIZE) {
      if (this.tiles[index] == null) {
        result++
      }
    }
    return result
  }

  _getRandomType () {
    return Math.floor(Math.random() * NUM_FRAMES)
  }

  _checkAdjacent (p1, p2) {
    return Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1
  }

  _logTile (t) {
    return t ? `${t.index}` : 'nil'
  }

  _logTiles (name, force) {
    console.log(this.tiles.map(this._logTile))
    console.log(this.tiles.map(this._logTile).slice(0, 6))
    console.log(this.tiles.map(this._logTile).slice(6, 12))
    console.log(this.tiles.map(this._logTile).slice(12, 18))
    console.log(this.tiles.map(this._logTile).slice(18, 24))
    console.log(this.tiles.map(this._logTile).slice(24, 30))
    console.log(this.tiles.map(this._logTile).slice(30, 36))
    console.log('=====================', name)
  }
}
