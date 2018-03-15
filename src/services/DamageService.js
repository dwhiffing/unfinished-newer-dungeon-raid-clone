import Phaser from 'phaser'
import Attack from '../sprites/Attack'

export default class DamageService {
  constructor (game, x, y) {
    this.game = game

    this.graphics = this.game.add.graphics(0, 0)
    this.graphics.beginFill(0x000000)
    this.graphics.drawRect(0, 0, this.game.width, this.game.height)
    this.graphics.alpha = 0

    this.group = this.game.add.group()
    this.group.position.setTo(x, y)
    this.attacks = []
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

  init (damageCallback) {
    this.damageCallback = damageCallback
  }

  update (dyingEnemies) {
    this.clear()
    dyingEnemies.forEach(this.showEnemyDying.bind(this))
  }

  showEnemyDying (enemy, i) {
    if (this.attacks.some(a => a.index === enemy.index)) {
      return
    }
    const attack = this.attacks.find(a => !a.visible)
    attack && attack.showDyingState(enemy.index)
  }

  clear () {
    this.attacks.forEach(t => t.destroy())
  }

  attack (enemies, armor) {
    return new Promise(resolve => {
      const damage = enemies.reduce((sum, n) => sum + n.damage, 0)

      if (damage === 0) {
        return resolve()
      }

      return this._showOverlay().then(() => {
        this._animateAttacks(enemies).then(() => {
          this._showDamage(armor, damage).then(() => {
            this._hideOverlay().then(resolve)
          })
        })
      })
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

  _animateAttacks (enemies) {
    return new Promise(resolve => {
      enemies.forEach((enemy, i) => {
        this.attacks.find(a => !a.visible).reset(enemy.index)
      })
      setTimeout(resolve, 500)
    })
  }

  _showDamage (armor = 0, damage = 0) {
    return new Promise(resolve => {
      this._resetBanner(damage)

      const armorDamage = Math.min(damage, armor)
      damage -= armorDamage
      const healthDamage = damage

      if (armorDamage > 0) {
        this._chainTween(this.game.width / 2, () => {
          this.damageCallback(armorDamage, 'armor')
        })
      }

      if (healthDamage > 0) {
        this._chainTween(this.game.width - 100, () => {
          this.damageCallback(healthDamage, 'health')
        })
      }

      this.tweens[this.tweens.length - 1].onComplete.add(resolve)
    })
  }

  _hideOverlay () {
    return new Promise(resolve => {
      this._tween(this.banner, { alpha: 0 }, 500)

      const overlayTween = this._tween(this.graphics, { alpha: 0 }, 500)
      overlayTween.onComplete.add(resolve)
    })
  }

  _tween (thing, opts, duration) {
    const tween = this.game.add
      .tween(thing)
      .to({ alpha: 0 }, 500, Phaser.Easing.None, true)
    return tween
  }

  _resetBanner (damage) {
    this.tweens = [
      this.game.add
        .tween(this.banner)
        .to({ alpha: 1 }, 500, Phaser.Easing.None, true)
    ]

    this.banner.text = `${damage} DMG`
    this.banner.x = this.game.width / 2
    this.banner.y = this.game.height / 2
  }

  _chainTween (position, onComplete) {
    const tween = this._animateDamage(position)
    this.tweens[this.tweens.length - 1].chain(tween)
    tween.onComplete.add(onComplete)
    this.tweens.push(tween)
  }

  _animateDamage (x) {
    const opts = { delay: 1500, y: this.game.height - 100, x }
    const tween = this.game.add
      .tween(this.banner)
      .to(opts, 500, Phaser.Easing.None)
    return tween
  }

  _initText (x, y, string, fill, size) {
    const text = this.game.add.text(x, y, string)
    text.padding.set(10, 16)
    text.anchor.setTo(0.5)
    text.fontSize = size
    text.fill = fill
    return text
  }
}
