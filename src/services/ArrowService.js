import Phaser from 'phaser'

export default class ArrowService {
  constructor (game, x, y, clearCallback) {
    this.addSprite = (x, y) => game.add.sprite(x, y, 'arrows')
    this.clearCallback = clearCallback
    this.update = this.update.bind(this)

    this.group = game.add.group()
    this.group.x = x
    this.group.y = y
    this.group.alpha = 0.9

    this.damageText = game.add.text(0, 0, 'dmg')

    this.clear()
  }

  update (position, tiles, damage) {
    if (JSON.stringify(tiles.map(t => t.index)) === this.tileIndexes) {
      return
    }

    this.clear()
    this.tileIndexes = JSON.stringify(tiles.map(t => t.index))

    if (damage > 0) {
      this.damageText.alpha = 1
      this.damageText.text = `${damage} DMG`
      this.damageText.x = position.x
      this.damageText.y = position.y - 80
    }

    tiles.forEach((tile, index) => {
      if (index === 0) {
        window.navigator.vibrate(10)
        return
      }

      this._createArrow(tiles[index], tiles[index - 1])
    })
  }

  clear () {
    this.tileIndexes = null
    this.group.removeAll(true)
    this.damageText.fill = '#f00'
    this.damageText.alpha = 0
    this.clearCallback()
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
}
