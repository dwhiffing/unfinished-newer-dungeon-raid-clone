import ArrowService from './ArrowService'
import TileService from './TileService'
import PlayerService from './PlayerService'
import MatchService from './MatchService'
import UIService from '../services/UIService'
import DamageService from '../services/DamageService'

export default class GameService {
  constructor (state) {
    this.game = window.game
    this.removedTiles = []
    this.visited = []
    this.state = state

    this.uiService = new UIService(this)
    this.tileService = new TileService(this)
    this.matchService = new MatchService(this)
    this.arrowService = new ArrowService(this)
    this.damageService = new DamageService(this)
    this.playerService = new PlayerService(this)

    this.allowInput = this.allowInput.bind(this)
    this.game.input.onDown.add(this.onPress, this)

    this.playerService.reset()
    this.updateUI()
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
    this.arrowService.updateArrow(this.matchService.getTilesInMatch())
  }

  onRelease () {
    this.game.input.onUp.remove(this.onRelease, this)
    this.game.input.deleteMoveCallback(this.onMove, this)

    this.arrowService.clear()

    const match = this.matchService.resolveMatch()
    if (match) {
      this.playerService.updateResources(match)
      this.updateUI()

      this.attackingEnemies = this.tileService.tiles.filter(
        t => t && t.frame === 0
      )

      this.tileService.applyGravity(match)

      const damage = this.playerService.damage(this.attackingEnemies)
      this.damageService.update(damage)
      this.updateUI()

      setTimeout(() => {
        this.damageService.clear()
        this.updateUI()
        this.allowInput()
      }, 500)
    } else {
      this.matchService.clearPath()
      this.allowInput()
    }
  }

  updateUI () {
    this.uiService.update(this.playerService.getStats())
  }

  allowInput () {
    if (!this.game.input.onDown.has(this.onPress, this)) {
      this.game.input.onDown.add(this.onPress, this)
    }
  }
}
