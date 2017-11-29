import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import MenuState from './states/Menu'
import GameOverState from './states/GameOver'

class Game extends Phaser.Game {
  constructor () {
    const width = window.innerWidth * window.devicePixelRatio
    const height = window.innerHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    window.gridDim = 6
    const tileSize = 70
    window.gridSize = window.gridDim * tileSize * window.devicePixelRatio / 3
    window.tileSize = window.gridSize / window.gridDim
    window.leftBuffer = window.innerWidth / 2 - window.gridSize / 2 - 1

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('Menu', MenuState, false)
    this.state.add('GameOver', GameOverState, false)
  }
}

window.game = new Game()
window.game.state.start('Boot')
