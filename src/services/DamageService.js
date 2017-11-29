import Phaser from 'phaser'
import Attack from '../sprites/Attack'

export default class DamageService {
  constructor (gameService) {
    this.game = gameService.game
    this.gameService = gameService
    this.playerService = gameService.playerService

    this.graphics = this.game.add.graphics(0, 0)
    this.graphics.beginFill(0x000000)
    this.graphics.drawRect(0, 0, this.game.width, this.game.height)
    this.graphics.alpha = 0

    this.attacks = []
    this.group = this.game.add.group()
    this.group.y = (window.innerHeight - window.gridSize) / 2
    for (let i = 0; i < 36; i++) {
      let attack = new Attack({ game: this.game })
      this.group.add(attack)
      this.attacks.push(attack)
    }

    this.banner = this._initText(
      this.game.width / 2,
      this.game.height / 2,
      '',
      '#ff0000',
      40
    )
    this.banner.alpha = 0
  }

  update (enemies) {
    return new Promise(resolve => {
      let damage = 0

      enemies.forEach(e => {
        damage += e.damage
      })

      if (damage === 0) {
        return resolve()
      }

      if (damage > 0) {
        this.enemies = enemies
        this.damage = damage

        return this._showOverlay().then(() => {
          this._animateAttacks().then(() => {
            this._showDamage().then(() => {
              this._hideOverlay().then(resolve)
            })
          })
        })
      }
    })
  }

  showDyingEnemies (enemies = this.enemies) {
    this.attacks.forEach(t => t.destroy())
    enemies.forEach((enemy, i) => {
      if (this.attacks.filter(a => a.index === enemy.index).length > 0) {
        return
      }
      const attack = this.attacks.find(a => !a.visible)
      if (attack) {
        attack.showDyingState(enemy.index)
      }
    })
  }

  _showOverlay () {
    return new Promise(resolve => {
      const tween = this.game.add
        .tween(this.graphics)
        .to({ alpha: 0.8 }, 250, Phaser.Easing.None, true)
      tween.onComplete.add(() => resolve())
    })
  }

  _animateAttacks () {
    return new Promise(resolve => {
      this.enemies.forEach((enemy, i) => {
        this.attacks.find(a => !a.visible).reset(enemy.index)
      })
      setTimeout(resolve, 500)
    })
  }

  _showDamage () {
    return new Promise(resolve => {
      this.banner.text = `${this.damage} DMG`
      this.banner.x = this.game.width / 2
      this.banner.y = this.game.height / 2

      const tweens = [
        this.game.add
          .tween(this.banner)
          .to({ alpha: 1 }, 500, Phaser.Easing.None, true)
      ]

      const { armor, health } = this._getDamage()

      if (armor > 0) {
        const toArmorTween = this.animateDamage(this.game.width / 2)
        tweens[tweens.length - 1].chain(toArmorTween)
        toArmorTween.onComplete.add(() => {
          this.playerService.armor -= armor
        })
        tweens.push(toArmorTween)
      }

      if (health > 0) {
        const toHealthTween = this.animateDamage(this.game.width - 100)
        tweens[tweens.length - 1].chain(toHealthTween)
        toHealthTween.onComplete.add(() => {
          this.playerService.health -= health
        })
        tweens.push(toHealthTween)
      }

      tweens[tweens.length - 1].onComplete.add(resolve)
    })
  }

  animateDamage (x) {
    const opts = { delay: 1500, y: this.game.height - 100, x }
    const tween = this.game.add
      .tween(this.banner)
      .to(opts, 500, Phaser.Easing.None)
    return tween
  }

  _hideOverlay () {
    return new Promise(resolve => {
      const tween = this.game.add
        .tween(this.graphics)
        .to({ alpha: 0 }, 500, Phaser.Easing.None, true)

      this.game.add
        .tween(this.banner)
        .to({ alpha: 0 }, 500, Phaser.Easing.None, true)

      tween.onComplete.add(resolve)
    })
  }

  _getDamage () {
    let armor = 0
    let health = 0
    let damage = this.damage

    if (this.playerService.armor > 0) {
      armor += damage
      damage -= this.playerService.armor
    }

    if (damage > 0) {
      health += damage
    }
    return { armor, health }
  }

  _initText (x, y, string, fill, size) {
    const text = this.game.add.text(x, y, string)
    text.padding.set(10, 16)
    text.smoothed = false
    text.anchor.setTo(0.5)
    text.fontSize = size
    text.fill = fill
    return text
  }
}
