import Tile from './Tile'

export default class extends Tile {
  constructor ({ game }) {
    super({ game })

    this.hpText = this._initText(game, 35, 30, `${this.hp}`, '#ff0000')
    this.indexText = this._initText(game, -13, -13, '', '#dddddd')
    this.damageText = this._initText(game, 35, -10, `${this.damage}`, '#ffffff')
    this.armorText = this._initText(game, 35, 5, `${this.armor}`, '#eeeeee')
    this.texts = [this.hpText, this.damageText, this.armorText]
    this.level = 1

    this.indexText.visible = false
  }

  reset (index, type) {
    super.reset(index, type)

    this.level += 0.2
    if (type === 0) {
      this._setStats(Math.floor(this.level))
      this.updateUI()
    } else {
      this._toggleStats(false)
    }
  }

  updateUI () {
    this._toggleStats(true)
    this.armorText.text = `${this.armor}`
    this.damageText.text = `${this.damage}`
    this.hpText.text = `${this.hp}`
  }

  setIndex (index) {
    super.setIndex(index)
    this.indexText.text = `${index}`
  }

  _toggleStats (value) {
    this.texts.forEach(t => {
      t.visible = value
    })
  }

  _setStats (level) {
    this.damage = level
    this.armor = level * 2
    this.hp = level * 4
  }

  _initText (game, x, y, string, fill) {
    const text = game.add.text(x, y, string)
    text.padding.set(10, 16)
    text.fontSize = 14
    text.anchor.setTo(0.5)
    text.fill = fill
    text.visible = this.frame === 0
    this.addChild(text)
    return text
  }
}