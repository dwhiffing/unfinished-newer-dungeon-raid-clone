export default class UIService {
  constructor () {
    const x = window.game.width
    const y = window.game.height

    this.footer = window.game.add.graphics(0, 0)
    this.footer.beginFill(0x222222)
    this.footer.drawRect(0, y - 115, x, y)
    this.footer.beginFill(0x888888)
    this.footer.drawRect(0, y - 115, x, 5)
    this.footer.endFill()
  }

  init (gameService) {
    this.state = gameService.state
    this.playerService = gameService.playerService
    const x = window.game.width
    const y = window.game.height
    const gold = this._initText(70, y - 40, '0/50', '#ffff00', 32)
    const health = this._initText(x - 70, y - 40, '50/50', '#ff0000', 32)
    const armor = this._initText(x / 2, y - 70, '0/4', '#6562F0', 18)
    const base = this._initText(x / 2 - 60, y - 70, '+5', '#ffffff', 18)
    const weapon = this._initText(x / 2 + 60, y - 70, '+3', '#ffffff', 18)
    const upgrade = this._initText(x / 2, y - 40, '0/100', '#6562F0', 24)
    const experience = this._initText(x / 2, y - 10, '0/100', '#00ff00', 24)

    this.texts = { gold, health, armor, base, weapon, upgrade, experience }
    this.update()
  }

  drawHeader () {
    const x = window.game.width
    this.header = window.game.add.graphics(0, 0)
    this.header.beginFill(0x222222)
    this.header.drawRect(0, 0, x, 120)
    this.header.beginFill(0x888888)
    this.header.drawRect(0, 115, x, 5)

    this._initText(x / 2, 60, 'Dungeon Raid', '#77BFA3', 40)
  }

  update () {
    const data = this.playerService.getStats()
    this.texts.gold.text = `${data.gold}/${data.maxGold}`
    this.texts.health.text = `${data.health}/${data.maxHealth}`
    this.texts.armor.text = `${data.armor}/${data.maxArmor}`
    this.texts.upgrade.text = `${data.upgrade}/${data.maxUpgrade}`
    this.texts.experience.text = `${data.experience}/${data.maxExperience}`
    this.texts.weapon.text = `${data.weapon}`
    this.texts.base.text = `${data.base}`
  }

  _initText (x, y, string, fill, size) {
    const state = window.game.state.states[window.game.state.current]
    const text = state.add.text(x, y, string)
    text.padding.set(10, 16)
    text.smoothed = false
    text.anchor.setTo(0.5)
    text.fontSize = size
    text.fill = fill
    return text
  }
}
