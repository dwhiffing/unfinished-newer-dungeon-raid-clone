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
      itemLevel: this._initText(70, y - 5, '0', '#ffff00', 18),
      health: this._initText(x - 70, y - 40, '50/50', '#ff0000', 32),
      armor: this._initText(x / 2, y - 85, '0/4', '#6562F0', 18),
      upgradeLevel: this._initText(x / 2, y - 60, '1', '#6562F0', 18),
      upgrade: this._initText(x / 2, y - 40, '0/100', '#6562F0', 24),
      experienceLevel: this._initText(x - 70, y - 5, '1', '#00ff00', 18),
      experience: this._initText(x / 2, y - 10, '0/100', '#00ff00', 24),
      strength: this._initText(70 - 40, y - 85, '1', '#ffffff', 18),
      dexterity: this._initText(70 - 10, y - 85, '1', '#6562F0', 18),
      vitality: this._initText(70 + 20, y - 85, '1', '#ff0000', 18),
      luck: this._initText(70 + 50, y - 85, '1', '#ffff00', 18),
      base: this._initText(x * 0.8 - 20, y - 85, '+5', '#ffffff', 18),
      weapon: this._initText(x * 0.8 + 20, y - 85, '+3', '#ffffff', 18)
    }

    this.textGroup.x = _x + 5
    this.group.add(this.textGroup)
    this.update(stats)
  }

  update (stats) {
    this.texts.gold.text = `${stats.gold.xp}/${stats.gold.xpToNext}`
    this.texts.itemLevel.text = `${stats.gold.level}`
    this.texts.health.text = `${stats.health}/${stats.maxHealth}`
    this.texts.armor.text = `${stats.armor}/${stats.maxArmor}`
    this.texts.upgrade.text = `${stats.upgrade.xp}/${stats.upgrade.xpToNext}`
    this.texts.upgradeLevel.text = `${stats.upgrade.level}`
    this.texts.experienceLevel.text = `${stats.player.level}`
    this.texts.experience.text = `${stats.player.xp}/${stats.player.xpToNext}`
    this.texts.base.text = `${stats.baseDamage}`
    this.texts.weapon.text = `${stats.weaponDamage}`
    this.texts.strength.text = `${stats.strength}`
    this.texts.dexterity.text = `${stats.dexterity}`
    this.texts.vitality.text = `${stats.vitality}`
    this.texts.luck.text = `${stats.luck}`
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
