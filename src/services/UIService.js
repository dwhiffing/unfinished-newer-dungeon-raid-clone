export default class UIService {
  constructor (gameService) {
    this.state = gameService.state
    const x = this.state.game.width
    const y = this.state.game.height

    const graphics = this.state.game.add.graphics(0, 0)
    graphics.beginFill(0x222222)
    graphics.drawRect(0, 0, x, 120)
    graphics.drawRect(0, y - 115, x, y)

    graphics.beginFill(0x888888)
    graphics.drawRect(0, 115, x, 5)
    graphics.drawRect(0, y - 115, x, 5)
    graphics.endFill()

    const banner = this._initText(x / 2, 60, 'Dungeon Raid', '#77BFA3', 40)
    banner.font = 'Bangers'

    const gold = this._initText(70, y - 40, '0/50', '#ffff00', 32)
    const health = this._initText(x - 70, y - 40, '50/50', '#ff0000', 32)
    const armor = this._initText(x / 2, y - 70, '0/4', '#0000ff', 18)
    const base = this._initText(x / 2 - 60, y - 70, '+5', '#ffffff', 18)
    const weapon = this._initText(x / 2 + 60, y - 70, '+3', '#ffffff', 18)
    const upgrade = this._initText(x / 2, y - 40, '0/100', '#0000ff', 24)
    const experience = this._initText(x / 2, y - 10, '0/100', '#00ff00', 24)

    this.texts = { gold, health, armor, base, weapon, upgrade, experience }
  }

  update (data) {
    this.texts.gold.text = `${data.gold}/${data.maxGold}`
    this.texts.health.text = `${data.health}/${data.maxHealth}`
    this.texts.armor.text = `${data.armor}/${data.maxArmor}`
    this.texts.upgrade.text = `${data.upgrade}/${data.maxUpgrade}`
    this.texts.experience.text = `${data.experience}/${data.maxExperience}`
    this.texts.weapon.text = `${data.weapon}`
    this.texts.base.text = `${data.base}`
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
