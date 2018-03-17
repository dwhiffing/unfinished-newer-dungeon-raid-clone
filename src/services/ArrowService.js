import Phaser from 'phaser'

// Responsible for:
// Rendering path for active match on path
// Relates to: TileService

const AFFIXES = ['DP', 'DP', 'AP', 'HP', 'GP']
const FILLS = ['#f00', '#f00', '#6562F0', '#f00', '#ff0']

export default class ArrowService {
  constructor (game, x, y) {
    this.addSprite = (x, y) => game.add.sprite(x, y, 'arrows')

    this.group = game.add.group()
    this.group.position.setTo(x, y)
    this.valueText = game.add.text(0, 0, 'dmg')

    this.clear()
  }

  update = (position, tiles, damage) => {
    if (this._stringifyTiles(tiles) === this.tileIndexes) {
      return
    } else {
      this.tileIndexes = this._stringifyTiles(tiles)
    }

    this.clear()

    if (tiles.length >= 3) {
      this.valueText.alpha = 1
      this.valueText.x = position.x
      this.valueText.y = position.y - 80

      const fill = FILLS[tiles[0].frame]
      this.valueText.fill = fill

      const number = damage > 0 ? damage : tiles.length
      const affix = AFFIXES[tiles[0].frame]
      this.valueText.text = `${number} ${affix}`
    }

    tiles.forEach((tile, index) => {
      if (index > 0) {
        this._createArrow(tiles[index], tiles[index - 1])
      }
    })
  }

  clear () {
    this.tileIndexes = null
    this.group.removeAll(true)
    this.valueText.fill = '#f00'
    this.valueText.alpha = 0
    this.arrows = []
  }

  _createArrow (a, b) {
    const arrow = this.addSprite(b.x, b.y)
    arrow.anchor.set(0.5)
    arrow.scale.setTo(window.ratio)
    this.group.add(arrow)
    this.arrows.push(arrow)

    const diff = new Phaser.Point(a.coordinate.x, a.coordinate.y)
    diff.subtract(b.coordinate.x, b.coordinate.y)

    if (diff.x === 0) {
      arrow.angle = -90 * diff.y
    } else {
      arrow.angle = 90 * (diff.x + 1)
      if (diff.y !== 0) {
        arrow.frame = 1
        if (diff.y + diff.x === 0) {
          arrow.angle -= 90
        }
      }
    }
  }

  _stringifyTiles (tiles) {
    return JSON.stringify(tiles.map(t => t.index))
  }
}
