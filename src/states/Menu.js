import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create (game) {
    const text = game.add.text(game.width / 2, game.height / 2, 'Dungeon Raid')
    text.fill = '#fff'
    text.inputEnabled = true
    text.anchor.setTo(0.5)
    text.events.onInputUp.add(() => {
      game.state.start('Game')
    })
  }
}
