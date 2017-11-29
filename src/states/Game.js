/* globals __DEV__ */
import Phaser from 'phaser'
import GameService from '../services/GameService'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.gameService = new GameService(this)
  }

  render () {
    if (__DEV__) {
      this.gameService.tileService.tiles.forEach(tile => {
        // this.game.debug.spriteBounds(tile, tile.x, tile.y)
      })
    }
  }
}
