import Phaser from 'phaser'

export default class DamageService {
  init (gameService) {
    this.state = gameService.state
    this.game = gameService.game
    this.playerService = gameService.playerService
    this.uiService = gameService.uiService

    const x = this.state.game.width
    const y = this.state.game.height
    this.graphics = this.state.game.add.graphics(0, 0)
    this.graphics.beginFill(0x000000)
    this.graphics.drawRect(0, 0, x, y)
    this.graphics.alpha = 0

    this.banner = this._initText(x / 2, y / 2, '', '#ff0000', 40)
    this.banner.alpha = 0
  }

  update (enemies) {
    let damage = 0
    enemies.forEach(e => {
      damage += e.damage
    })
    if (damage > 0) {
      this.banner.text = `${damage} DMG`
      const tween = this.game.add
        .tween(this.graphics)
        .to({ alpha: 0.8 }, 1000, Phaser.Easing.None, true)

      tween.onComplete.add(() => {
        const tween = this.game.add
          .tween(this.banner)
          .to({ alpha: 1 }, 1000, Phaser.Easing.None, true)

        tween.onComplete.add(() => {
          this.playerService.health -= damage
          this.uiService.update()

          this.game.add
            .tween(this.graphics)
            .to({ alpha: 0 }, 2000, Phaser.Easing.None, true)

          this.game.add
            .tween(this.banner)
            .to({ alpha: 0 }, 2000, Phaser.Easing.None, true)
        })
      })
    }
  }

  _initText (x, y, string, fill, size) {
    const text = this.state.add.text(x, y, string)
    text.padding.set(10, 16)
    text.smoothed = false
    text.anchor.setTo(0.5)
    text.fontSize = size
    text.fill = fill
    return text
  }
}
