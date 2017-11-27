import Phaser from 'phaser'

export default class ArrowService {
  constructor () {
    this.game = window.game
    this.update = this.update.bind(this)

    this.group = this.game.add.group()
    this.group.x = 0
    this.group.y = 125
    this.group.alpha = 0.9
  }

  update (tiles) {
    this.clear()
    tiles.forEach((tile, index) => {
      if (index === 0) {
        return
      }

      this._createArrow(tiles[index], tiles[index - 1])
    })
  }

  clear () {
    this.group.removeAll(true)
    this.arrows = []
  }

  _createArrow (a, b) {
    const arrow = this.game.add.sprite(b.x, b.y, 'arrows')
    arrow.anchor.set(0.5)
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
}
