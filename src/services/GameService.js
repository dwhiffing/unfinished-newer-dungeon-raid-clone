import ArrowService from './ArrowService'
import TileService from './TileService'
import PlayerService from './PlayerService'
import MatchService from './MatchService'
import Menu from '../sprites/Menu'
import UIService from './UIService'
import DamageService from './DamageService'

let _x, _y

// Responsible for:
// handling input
// orchestrating game logic/services
// (deferring to services for lower level tasks and informing other services)
// managing game state

export default class GameService {
  constructor () {
    this.game = window.game
    _x = window.leftBuffer
    _y = window.topBuffer

    this.shouldVibrate = false

    this.allowInput = this.allowInput.bind(this)
    this.postTurn = this.postTurn.bind(this)
    this._getHurt = this._getHurt.bind(this)

    this.uiService = new UIService(this.game, this.game.width, this.game.height)
    this.tileService = new TileService(this.game, _x, _y)
    this.playerService = new PlayerService(this.game, _x, _y)
    this.damageService = new DamageService(this.game, _x, _y)
    this.arrowService = new ArrowService(this.game, _x, _y)
    this.matchService = new MatchService(this.game, _x, _y)
    this.menu = new Menu(this.game, this.game.width / 2, this.game.height / 2)

    this._loadSave()
    this.allowInput()
  }

  onPress ({ position }) {
    const tileSelected = this.matchService.selectTile(
      this.tileService.getTile(position)
    )

    if (tileSelected) {
      this.game.input.onDown.remove(this.onPress, this)
      this.game.input.onUp.add(this.onRelease, this)
      this.game.input.addMoveCallback(this.onMove, this)
    }
  }

  onMove ({ position }) {
    const tiles = this.matchService.getTilesInMatch()
    const damage = this._calculateDamageFromTiles(tiles)

    this.matchService.selectTile(this.tileService.getTile(position))
    this.damageService.update(this.matchService.getDyingEnemies(damage))

    if (tiles.length < 2) {
      this._vibrate(10)
    } else {
      this.arrowService.update(position, tiles, damage)
    }
  }

  onRelease () {
    this.game.input.onUp.remove(this.onRelease, this)
    this.game.input.deleteMoveCallback(this.onMove, this)

    this.arrowService.clear()
    this.damageService.clear()

    const match = this.matchService.resolveMatch()
    if (match) {
      this.handleTurn(match)
    } else {
      this.matchService.clearPath()
      this.allowInput()
    }
  }

  handleTurn (match) {
    let damage = this._calculateDamageFromTiles(match)
    let gold = 0
    let potion = 0
    let armor = 0
    let experience = 0

    match.forEach(tile => {
      if (tile.frame === 4) {
        gold++
      } else if (tile.frame === 3) {
        potion++
      } else if (tile.frame === 2) {
        armor++
      }

      if (tile.frame > 0) {
        this.tileService.destroyTile(tile.index)
      } else {
        const enemyKilled = this.damageEnemy(tile, damage)
        if (enemyKilled) {
          experience++
        }
      }
    })

    this.playerService.update({ gold, potion, armor, experience })
    this.tileService.applyGravity(match).then(this.postTurn)
  }

  postTurn (enemies) {
    const menu = this.playerService.getMenuState()
    if (menu) {
      this.menu.show({
        data: menu.data,
        title: menu.title,
        callback: () => this.applyDamage(enemies)
      })
    } else {
      this.applyDamage(enemies)
    }
  }

  damageEnemy (enemy, damage = 0) {
    enemy.unpick()
    let _damage = damage

    _damage -= enemy.armor
    enemy.armor -= damage
    enemy.hp -= _damage

    if (enemy.armor < 0) {
      enemy.armor = 0
    }

    enemy.updateUI()

    if (enemy.hp <= 0) {
      this.tileService.destroyTile(enemy.index)
      return true
    }
  }

  applyDamage (enemies) {
    this.playerService.state = 0
    this.damageService
      .attack(enemies, this.playerService.armor)
      .then(this.allowInput)
  }

  allowInput () {
    this.playerService.save()
    this.tileService.save()
    if (!this.game.input.onDown.has(this.onPress, this)) {
      this.game.input.onDown.add(this.onPress, this)
    }
  }

  _vibrate (n) {
    if (window.navigator.vibrate && this.shouldVibrate) {
      window.navigator.vibrate(n)
    }
  }

  _getHurt (damage, type) {
    if (type === 'armor') {
      this._vibrate(50)
      this.playerService.armor -= damage
    } else if (type === 'health') {
      this._vibrate(200)
      this.playerService.health -= damage
    }
  }

  _gameOver () {
    this.game.state.start('GameOver')
    localStorage.removeItem('player')
    localStorage.removeItem('tile')
  }

  _loadSave () {
    let tileData = null
    let playerData = null

    try {
      tileData = JSON.parse(localStorage.getItem('tile'))
      playerData = JSON.parse(localStorage.getItem('player'))
    } catch (e) {}

    this.playerService.init(
      playerData,
      this.uiService.update,
      this._gameOver,
      this._vibrate
    )
    this.tileService.init(tileData)
    this.damageService.init(this._getHurt)
    this.matchService.init(this.tileService.tiles)
    this.uiService.init(_x, _y, this.playerService.getStats())
  }

  _calculateDamageFromTiles (tiles) {
    if (tiles[0].frame > 1 || tiles.length < 3) {
      return 0
    }

    const swords = tiles.reduce((s, t) => s + (t.frame === 1 ? 1 : 0), 0)

    return (
      this.playerService.weaponDamage * swords + this.playerService.baseDamage
    )
  }
}
