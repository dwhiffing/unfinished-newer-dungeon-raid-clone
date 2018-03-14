import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBg'
    )
    this.loaderBar = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBar'
    )
    this.loaderBg.anchor.setTo(0.5)
    this.loaderBar.anchor.setTo(0.5)

    this.load.setPreloadSprite(this.loaderBar)
    this.load.spritesheet('arrows', 'assets/images/arrows.png', 210, 210)
    this.load.spritesheet('tile', 'assets/images/tile.png', 64, 64)
    this.load.image('menu', 'assets/images/menu.png')
    this.load.image('box', 'assets/images/box.png')
  }

  create () {
    this.state.start('Game')
  }
}
