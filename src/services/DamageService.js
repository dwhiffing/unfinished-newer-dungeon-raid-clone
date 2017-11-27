import Phaser from 'phaser'
import Attack from '../sprites/Attack'

export default class DamageService {
  constructor (gameService) {
    this.state = gameService.state
    this.game = gameService.game
    this.playerService = gameService.playerService
    this.uiService = gameService.uiService

    const x = this.game.width
    const y = this.game.height
    this.graphics = this.game.add.graphics(0, 0)
    this.graphics.beginFill(0x000000)
    this.graphics.drawRect(0, 0, x, y)
    this.graphics.alpha = 0

    this.attacks = []
    this.group = this.game.add.group()
    this.group.y = 125

    this.dealArmor = this.dealArmor.bind(this)
    this.dealHealth = this.dealHealth.bind(this)

    for (let i = 0; i < 36; i++) {
      let attack = new Attack({ game: this.game })
      this.group.add(attack)
      this.attacks.push(attack)
    }

    this.banner = this._initText(x / 2, y / 2, '', '#ff0000', 40)
    this.banner.alpha = 0
  }

  update (enemies, callback) {
    this.callback = callback
    let damage = 0

    enemies.forEach(e => {
      damage += e.damage
    })

    if (damage > 0) {
      this.enemies = enemies
      this.damage = damage
      this.showOverlay(this.animateAttacks.bind(this))
    } else {
      this.callback()
    }
  }

  showOverlay (callback) {
    const tween = this.game.add
      .tween(this.graphics)
      .to({ alpha: 0.8 }, 250, Phaser.Easing.None, true)
    tween.onComplete.add(callback)
  }

  animateAttacks () {
    this.enemies.forEach((enemy, i) => {
      const attack = this.attacks.find(a => !a.visible)
      if (i === 0) {
        attack.reset(enemy.index, this.showDamage.bind(this))
      } else {
        attack.reset(enemy.index)
      }
    })
  }

  showDamage () {
    this.banner.text = `${this.damage} DMG`
    this.banner.x = this.game.width / 2
    this.banner.y = this.game.height / 2
    const tween1 = this.game.add
      .tween(this.banner)
      .to({ alpha: 1 }, 500, Phaser.Easing.None, true)

    const { armor, health } = this.getDamage()
    const onCompleteHP = (x, callback) => {
      const tween = this.game.add.tween(this.banner).to(
        {
          delay: 1500,
          y: this.game.height - 100,
          x
        },
        500,
        Phaser.Easing.None
      )
      callback && tween.onComplete.add(callback)
      return tween
    }

    if (armor > 0) {
      const tween2 = onCompleteHP(this.game.width / 2, this.dealArmor)
      tween1.chain(tween2)
      if (health > 0) {
        const tween3 = onCompleteHP(this.game.width - 100, this.dealHealth)
        tween2.chain(tween3)
        tween3.onComplete.add(this.hideOverlay, this)
      } else {
        tween2.onComplete.add(this.hideOverlay, this)
      }
    } else {
      const tween2 = onCompleteHP(this.game.width - 100, this.dealHealth)
      tween1.chain(tween2)
      tween2.onComplete.add(this.hideOverlay, this)
    }
  }

  getDamage () {
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

  dealArmor () {
    const { armor } = this.getDamage()
    this.playerService.armor -= armor
    this.uiService.update()
  }

  dealHealth () {
    const { health } = this.getDamage()
    this.playerService.health -= health
    this.uiService.update()
  }

  hideOverlay () {
    const tween = this.game.add
      .tween(this.graphics)
      .to({ alpha: 0 }, 500, Phaser.Easing.None, true)

    this.game.add
      .tween(this.banner)
      .to({ alpha: 0 }, 500, Phaser.Easing.None, true)

    tween.onComplete.add(this.callback)
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
