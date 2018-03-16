export default class UIService {
  constructor (game, x, y) {
    this.game = game
    this.group = this.game.add.group()
    this.update = this.update.bind(this)

    this.footer = game.add.graphics(0, 0)
    this.footer.beginFill(0x222222)
    this.footer.drawRect(0, y - 115, x, y)
    this.footer.beginFill(0x888888)
    this.footer.drawRect(0, y - 115, x, 5)
    this.footer.endFill()
    this.group.add(this.footer)
  }

  init (_x, _y, stats) {
    this.textGroup = this.game.add.group()

    const { width, height } = this.game
    const x = width >= window.gridSize ? window.gridSize : width
    const y = height

    this.texts = {
      gold: this._initText(70, y - 40, '0/50', '#ffff00', 32),
      health: this._initText(x - 70, y - 40, '50/50', '#ff0000', 32),
      armor: this._initText(x / 2, y - 70, '0/4', '#6562F0', 18),
      base: this._initText(x / 2 - 60, y - 70, '+5', '#ffffff', 18),
      weapon: this._initText(x / 2 + 60, y - 70, '+3', '#ffffff', 18),
      upgrade: this._initText(x / 2, y - 40, '0/100', '#6562F0', 24),
      experience: this._initText(x / 2, y - 10, '0/100', '#00ff00', 24)
    }

    this.textGroup.x = _x + 5
    this.group.add(this.textGroup)
    this.update(stats)
  }

  update (stats) {
    this.texts.gold.text = `${stats.gold}/${stats.maxGold}`
    this.texts.health.text = `${stats.health}/${stats.maxHealth}`
    this.texts.armor.text = `${stats.armor}/${stats.maxArmor}`
    this.texts.upgrade.text = `${stats.upgrade}/${stats.maxUpgrade}`
    this.texts.experience.text = `${stats.experience}/${stats.maxExperience}`
    this.texts.weapon.text = `${stats.weaponDamage}`
    this.texts.base.text = `${stats.baseDamage}`
  }

  _initText (x, y, string, fill, size) {
    const state = this.game.state.states[this.game.state.current]
    const text = state.add.text(x, y, string)
    text.padding.set(10, 16)
    text.anchor.setTo(0.5)
    text.fontSize = size
    text.fill = fill
    this.textGroup.add(text)
    return text
  }
}
