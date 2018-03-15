import ArrowService from './ArrowService'
import TileService from './TileService'
import PlayerService from './PlayerService'
import MatchService from './MatchService'
import Menu from '../sprites/Menu'
import UIService from './UIService'
import DamageService from './DamageService'

export default class GameService {
  constructor (state) {
    this.game = window.game
    this.removedTiles = []
    this.visited = []
    this.state = state

    const x = window.leftBuffer
    const y = window.topBuffer

    let tileData = null
    let playerData = null

    try {
      tileData = JSON.parse(localStorage.getItem('tile'))
      playerData = JSON.parse(localStorage.getItem('player'))
    } catch (e) {}

    this.allowInput = this.allowInput.bind(this)
    this.game.input.onDown.add(this.onPress, this)

    this.uiService = new UIService(this.game, this.game.width, this.game.height)
    this.tileService = new TileService(this, x, y)
    this.playerService = new PlayerService(this, x, y)

    this.tileService.init(this, tileData)
    this.playerService.init(this, playerData)

    this.damageService = new DamageService(this, x, y)

    this.uiService.init(this, x, y)

    this.arrowService = new ArrowService(this.game, x, y)

    this.matchService = new MatchService(this, x, y)

    this.menu = new Menu({ game: this.game })
  }

  onPress ({ position }) {
    const tileSelected = this.matchService.selectTile(position)
    if (tileSelected) {
      this.game.input.onDown.remove(this.onPress, this)
      this.game.input.onUp.add(this.onRelease, this)
      this.game.input.addMoveCallback(this.onMove, this)
    }
  }

  onMove ({ position }) {
    const tiles = this.matchService.getTilesInMatch()
    let damage = 0

    this.damageService.clear()

    if (tiles[0].frame <= 1 && tiles.length >= 3) {
      const swords = tiles.reduce((s, t) => s + (t.frame === 1 ? 1 : 0), 0)
      damage =
        this.playerService.weaponDamage * swords + this.playerService.baseDamage
      const dyingEnemies = tiles.filter(
        t => t.frame === 0 && t.armor + t.hp - damage <= 0
      )

      this.damageService.showDyingEnemies(dyingEnemies)
    }

    this.matchService.selectTile(position)
    this.arrowService.update(position, tiles, damage)
  }

  onRelease () {
    this.game.input.onUp.remove(this.onRelease, this)
    this.game.input.deleteMoveCallback(this.onMove, this)

    this.arrowService.clear()
    this.damageService.clear()

    const match = this.matchService.resolveMatch()
    if (match) {
      this.playerService.updateResources(match)

      const enemies = this.tileService.tiles.filter(t => t && t.frame === 0)
      this.tileService.applyGravity(match).then(() => {
        const menu = this.playerService.getMenuState()
        if (!menu) {
          return this.applyDamage(enemies)
        }

        this.menu.show({
          data: menu.data,
          title: menu.title,
          callback: () => this.applyDamage(enemies)
        })
      })
      return
    }

    this.matchService.clearPath()
    this.allowInput()
  }

  applyDamage (enemies) {
    this.playerService.state = 0
    this.damageService.update(enemies).then(() => {
      this.allowInput()
    })
  }

  allowInput () {
    this.playerService.save()
    this.tileService.save()
    if (!this.game.input.onDown.has(this.onPress, this)) {
      this.game.input.onDown.add(this.onPress, this)
    }
  }
}
