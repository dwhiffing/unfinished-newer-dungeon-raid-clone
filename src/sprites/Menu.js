import Phaser from 'phaser'
import Upgrade from './Upgrade'

export default class Menu {
  constructor ({ game }) {
    this.game = game

    this.group = game.add.group()
    const background = game.add.sprite(0, 0, 'menu')
    this.group.add(background)
    this.callback = () => {}

    this.title = this.game.add.text(20, 20, 'Upgrade!')
    this.title.fontSize = 24
    this.title.fill = '#ffffff'
    this.group.add(this.title)
    this.group.alpha = 0
    this.group.scale.setTo(window.ratio)
    this.group.position = {
      x: this.game.width / 2 - this.group.width / 2,
      y: this.game.height / 2 - this.group.height / 2
    }

    this.upgrades = []
    const arr = [0, 1, 2, 3]
    arr.forEach(i => {
      const upgrade = new Upgrade({
        game,
        x: 20,
        y: i * 70 + 60,
        callback: this.clickOption.bind(this)
      })
      this.upgrades.push(upgrade)
      this.group.add(upgrade.group)
    })
  }

  show ({ title, data, callback }) {
    this.callback = callback
    this._deselect()

    this.title.text = title

    Object.values(data).forEach((d, i) => {
      this.upgrades[i].reset(d)
    })

    this.game.add
      .tween(this.group)
      .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true)
  }

  hide () {
    return new Promise(resolve => {
      const tween = this.game.add
        .tween(this.group)
        .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
      tween.onComplete.add(resolve)
    })
  }

  clickOption (n) {
    if (this.selected === n) {
      this.hide().then(this.callback)
      return
    }
    this._deselect()
    n.select()
    this.selected = n
  }

  _deselect () {
    this.selected = null
    this.upgrades.forEach(t => t.deselect())
  }
}
