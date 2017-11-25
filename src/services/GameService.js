import ArrowService from './ArrowService'
import TileService from './TileService'
import PlayerService from './PlayerService'
import MatchService from './MatchService'
import UIService from '../services/UIService'

export default class GameService {
  constructor (state) {
    this.game = window.game
    this.removedTiles = []
    this.visited = []
    this.state = state

    this.tileService = new TileService(this)
    this.matchService = new MatchService(this)
    this.arrowService = new ArrowService(this)
    this.uiService = new UIService(this)
    this.playerService = new PlayerService(this)

    this.allowInput = this.allowInput.bind(this)
    this.game.input.onDown.add(this.onPress, this)
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

    const match = this.matchService.resolveMatch()
    if (match) {
      this.playerService.updateResources(match)
    } else {
      this.allowInput()
    }

    this.arrowService.clear()
    this.tileService.applyGravity(match, this.allowInput)
  }

  allowInput () {
    if (!this.game.input.onDown.has(this.onPress, this)) {
      this.game.input.onDown.add(this.onPress, this)
    }
  }
}
