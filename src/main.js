import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import MenuState from './states/Menu'
import GameOverState from './states/GameOver'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const $ = document.documentElement
    const width =
      $.clientWidth > config.gameWidth ? config.gameWidth : $.clientWidth
    const height =
      $.clientHeight > config.gameHeight ? config.gameHeight : $.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('Menu', MenuState, false)
    this.state.add('GameOver', GameOverState, false)
  }
}

window.game = new Game()
window.game.state.start('Boot')
