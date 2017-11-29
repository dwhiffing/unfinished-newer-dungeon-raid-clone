import Phaser from 'phaser'

export default class ArrowService {
  constructor (gameService) {
    this.game = window.game
    this.playerService = gameService.playerService
    this.damageService = gameService.damageService
    this.update = this.update.bind(this)

    this.group = this.game.add.group()
    this.group.x = window.leftBuffer
    this.group.y = (window.innerHeight - window.gridSize) / 2
    this.group.alpha = 0.9

    this.damageText = this.game.add.text(0, 0, 'dmg')

    this.clear()
  }

  update (position, tiles) {
    this.damageText.x = position.x
    this.damageText.y = position.y - 30

    if (JSON.stringify(tiles.map(t => t.index)) === this.tileIndexes) {
      return
    }

    this.clear()
    this.tileIndexes = JSON.stringify(tiles.map(t => t.index))

    if (tiles[0].frame <= 1 && tiles.length >= 3) {
      const swords = tiles.reduce((s, t) => s + (t.frame === 1 ? 1 : 0), 0)
      const damage =
        this.playerService.weaponDamage * swords + this.playerService.baseDamage
      const dyingEnemies = tiles.filter(
        t => t.frame === 0 && t.armor + t.hp - damage <= 0
      )

      this.damageText.alpha = 1
      this.damageText.text = `${damage} DMG`
      this.damageService.showDyingEnemies(dyingEnemies)
    }

    tiles.forEach((tile, index) => {
      if (index === 0) {
        return
      }

      this._createArrow(tiles[index], tiles[index - 1])
    })
  }

  clear () {
    this.tileIndexes = null
    this.group.removeAll(true)
    this.damageText.fill = '#f00'
    this.damageText.alpha = 0
    this.damageService.attacks.forEach(t => t.destroy())
    this.arrows = []
  }

  _createArrow (a, b) {
    const arrow = this.game.add.sprite(b.x, b.y, 'arrows')
    arrow.anchor.set(0.5)
    arrow.scale.setTo(window.ratio)
    this.group.add(arrow)
    this.arrows.push(arrow)

    const diff = new Phaser.Point(a.coordinate.x, a.coordinate.y)
    diff.subtract(b.coordinate.x, b.coordinate.y)

    if (diff.x === 0) {
      arrow.angle = -90 * diff.y
    } else {
      arrow.angle = 90 * (diff.x + 1)
      if (diff.y !== 0) {
        arrow.frame = 1
        if (diff.y + diff.x === 0) {
          arrow.angle -= 90
        }
      }
    }
  }
}
