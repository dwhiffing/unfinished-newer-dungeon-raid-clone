export default class UIService {
  constructor (game, x, y) {
    this.game = game
    this.group = this.game.add.group()

    this.header = game.add.graphics(0, 0)
    this.header.beginFill(0x222222)
    this.header.drawRect(0, 0, x, 90)
    this.header.beginFill(0x888888)
    this.header.drawRect(0, 90, x, 5)
    this.header.endFill()
    this.group.add(this.header)

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
    this.textGroup.x = _x + 5
    this.group.bringToTop(this.header)
    this.group.add(this.textGroup)

    const { width } = this.game
    const x = width >= window.gridSize ? window.gridSize : width

    this.texts = {
      gold: this._initText(50, 35, '0/50', '#ffff00', 24),
      item: this._initText(50, 75, '0/100', '#6562F0', 24),
      damage: this._initText(x / 2, 40, '', '#ffffff', 18),
      armor: this._initText(x / 2, 80, '0/4', '#6562F0', 30),
      health: this._initText(x - 50, 35, '50/50', '#ff0000', 24),
      exp: this._initText(x - 50, 75, '0/100', '#00ff00', 24)
    }

    this.update(stats)
  }

  update = stats => {
    const { health, armor, gold, item, exp } = stats
    this.texts.health.text = `${health.value}/${health.max}`
    this.texts.armor.text = `${armor.value}/${armor.max}`
    this.texts.gold.text = `${gold.level}: ${gold.xp}/${gold.toNext}`
    this.texts.item.text = `${item.level}: ${item.xp}/${item.toNext}`
    this.texts.exp.text = `${exp.level}: ${exp.xp}/${exp.toNext}`
    this.texts.damage.text = `${stats.baseDamage}/${stats.weaponDamage}`
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
