import Phaser from 'phaser'

const GRID_SIZE = 6
const TILE_SIZE = 70

export default class extends Phaser.Sprite {
  constructor ({ game }) {
    super(game, 0, 0, 'tile')
    this.anchor.setTo(0.5)
    this.visible = false
  }

  reset (index, callback) {
    const coords = this._getCoordsFromIndex(index)
    this.position = {
      x: coords.x * TILE_SIZE + 30,
      y: coords.y * TILE_SIZE + 30
    }
    this.alpha = 0
    this.visible = true
    this.tween(callback)
  }

  tween (callback) {
    const tween = this.game.add
      .tween(this)
      .to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true)

    tween.onComplete.add(() => {
      const tween = this.game.add
        .tween(this)
        .to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true)
      tween.onComplete.add(() => {
        this.visible = false
        callback && callback()
      })
    })

    return tween
  }

  _getCoordsFromIndex (index) {
    return { y: Math.floor(index / GRID_SIZE), x: index % GRID_SIZE }
  }
}
