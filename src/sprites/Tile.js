import Phaser from 'phaser'

const ANIMATION_DURATION = 180
const GRID_SIZE = 6

// Enemy Sword Shield Potion Gold

export default class extends Phaser.Sprite {
  constructor ({ game, size }) {
    super(game, 0, 0, 'tile')
    this.size = size
    this.anchor.setTo(0.5)
    this.visible = false
  }

  reset (index, type) {
    const coords = this._getCoordsFromIndex(index)
    this.position = {
      x: coords.x * this.size + 30,
      y: coords.y * this.size + 30
    }
    this.coordinate = new Phaser.Point(coords.x, coords.y)
    this.scale.setTo(1)
    this.angle = 0
    this.frame = type
    this.index = index
    this.visible = true
    this.picked = false
  }

  fall (fallDistance, callback) {
    const duration = ANIMATION_DURATION * fallDistance
    this.tween(fallDistance, callback, duration)
    const { x, y } = this._getCoordsFromIndex(this.index)
    this.coordinate = new Phaser.Point(x, y)
  }

  respawn (index, type, fallDistance, callback) {
    const row = Math.floor(index / GRID_SIZE)
    const othY = Math.abs(fallDistance - row)
    this.reset(index % GRID_SIZE, type)
    this.position = {
      x: (index % GRID_SIZE) * this.size + 30,
      y: -othY * this.size + 30
    }
    const { x, y } = this._getCoordsFromIndex(index)
    this.coordinate = new Phaser.Point(x, y)
    this.index = index

    const duration =
      ANIMATION_DURATION * fallDistance * (Math.abs(this.y - 1000) / 1000)

    this.tween(fallDistance, callback, duration)
    return this
  }

  pick () {
    this.picked = true
  }

  unpick () {
    this.picked = false
  }

  destroy () {
    let x = this.game.width / 2
    if (this.frame === 4) {
      x = 100
    }
    if (this.frame === 3) {
      x = this.game.width - 100
    }
    this.matchTween(x, this.game.height - 170, () => {
      this.visible = false
    })
  }

  tween (y, callback, duration) {
    const tween = this.game.add
      .tween(this)
      .to(
        { y: this.y + y * this.size },
        duration,
        Phaser.Easing.Linear.None,
        true
      )

    callback && tween.onComplete.add(callback, this)
    return tween
  }

  matchTween (x, y, callback) {
    const duration = 1000
    const tween = this.game.add
      .tween(this)
      .to({ x, y }, duration, Phaser.Easing.Linear.None, true)
    callback && tween.onComplete.add(callback, this)

    this.game.add
      .tween(this.scale)
      .to({ x: 0.2, y: 0.2 }, duration, Phaser.Easing.Linear.None, true)

    return tween
  }

  _getCoordsFromIndex (index) {
    return { y: Math.floor(index / GRID_SIZE), x: index % GRID_SIZE }
  }
}
