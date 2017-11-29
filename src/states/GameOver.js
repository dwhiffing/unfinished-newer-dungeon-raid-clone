import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create (game) {
    const text = game.add.text(game.width / 2, game.height / 2, 'Game Over')
    text.fill = '#fff'
    text.anchor.setTo(0.5)
    text.inputEnabled = true
    text.events.onInputUp.add(() => {
      game.state.start('Menu')
    })
  }
}
