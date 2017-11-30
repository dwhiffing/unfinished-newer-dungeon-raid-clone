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

    this.allowInput = this.allowInput.bind(this)
    this.game.input.onDown.add(this.onPress, this)

    this.uiService = new UIService()
    this.tileService = new TileService()
    this.playerService = new PlayerService()

    this.tileService.init(this, JSON.parse(localStorage.getItem('tile')))
    this.playerService.init(this, JSON.parse(localStorage.getItem('player')))

    this.damageService = new DamageService(this)

    this.uiService.init(this)

    this.arrowService = new ArrowService(this)
    this.matchService = new MatchService(this)

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
    this.matchService.selectTile(position)
    this.arrowService.update(position, this.matchService.getTilesInMatch())
  }

  onRelease () {
    this.game.input.onUp.remove(this.onRelease, this)
    this.game.input.deleteMoveCallback(this.onMove, this)

    this.arrowService.clear()

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
