import Phaser from 'phaser'

export default class ArrowService {
  constructor () {
    this.game = window.game
    this.group = this.game.add.group()
    this.group.x = 0
    this.group.y = 125
    this.updateArrow = this.updateArrow.bind(this)
    this.group.alpha = 0.9
    this.arrows = []
  }

  updateArrow (tiles) {
    this.clear()
    tiles.forEach((tile, index) => {
      if (index === 0) {
        return
      }

      const arrow = this.game.add.sprite(
        tiles[index - 1].x,
        tiles[index - 1].y,
        'arrows'
      )
      arrow.anchor.set(0.5)
      this.group.add(arrow)
      this.arrows.push(arrow)

      const diff = new Phaser.Point(
        tiles[index].coordinate.x,
        tiles[index].coordinate.y
      )
      diff.subtract(
        tiles[index - 1].coordinate.x,
        tiles[index - 1].coordinate.y
      )

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
    })
  }

  clear () {
    this.group.removeAll(true)
    this.arrows = []
  }

  chunk (array, size, guard) {
    var length = array == null ? 0 : array.length
    if (!length || size < 1) {
      return []
    }
    var index = 0
    var resIndex = 0
    var result = Array(Math.ceil(length / size))

    while (index < length) {
      result[resIndex++] = array.slice(index, (index += size))
    }
    return result
  }
}
