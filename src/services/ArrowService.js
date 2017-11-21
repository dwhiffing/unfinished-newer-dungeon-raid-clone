import Phaser from 'phaser'

export default class ArrowService {
  constructor () {
    this.game = window.game
    this.group = this.game.add.group()
    this.group.x = 35
    this.group.y = 160
    this.arrows = []
    this.addArrow = this.addArrow.bind(this)
  }

  addArrow (tiles) {
    const arrow = this.game.add.sprite(tiles[1].x, tiles[1].y, 'arrows')
    arrow.anchor.set(0.5)
    this.group.add(arrow)
    this.arrows.push(arrow)

    const diff = new Phaser.Point(tiles[0].coordinate.x, tiles[0].coordinate.y)
    diff.subtract(tiles[1].coordinate.x, tiles[1].coordinate.y)

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

  clear () {
    this.group.removeAll(true)
    this.arrows = []
  }
}
