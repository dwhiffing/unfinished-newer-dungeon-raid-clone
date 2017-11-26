import Phaser from 'phaser'

const ANIMATION_DURATION = 250
const GRID_SIZE = 6

// Enemy Sword Shield Potion Gold

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, size, frame, index }) {
    super(game, x * size, y * size, 'tile')
    this.frame = frame
    this.index = index
    this.size = size
  }

  reset (index, type) {
    const coords = this._getCoordsFromIndex(index)
    this.position = { x: coords.x * this.size, y: coords.y * this.size }
    this.coordinate = new Phaser.Point(coords.x, coords.y)
    this.alpha = 0.7
    this.frame = type
    this.index = index
    this.visible = true
    this.picked = false
  }

  fall (holes, callback) {
    this.tween(holes, callback)
    const { x, y } = this._getCoordsFromIndex(this.index)
    this.coordinate = new Phaser.Point(x, y)
  }

  respawn (index, type, fallDistance, callback) {
    this.reset(index % GRID_SIZE, type)
    this.position = { x: (index % GRID_SIZE) * this.size, y: -1 * this.size }
    this.index = index

    const { x, y } = this._getCoordsFromIndex(index)
    this.coordinate = new Phaser.Point(x, y)
    this.tween(fallDistance, callback)
    return this
  }

  pick () {
    this.picked = true
    this.alpha = 1
  }

  unpick () {
    this.picked = false
    this.alpha = 0.7
  }

  destroy () {
    this.visible = false
  }

  tween (y, callback) {
    // This makes the tiles fall at a consisten speed, but would need to fix callback for next move
    // When some times are falling slower than others, input is allowed too early
    // const duration = ANIMATION_DURATION * y
    const duration = ANIMATION_DURATION
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

  _getCoordsFromIndex (index) {
    return { y: Math.floor(index / GRID_SIZE), x: index % GRID_SIZE }
  }
}
