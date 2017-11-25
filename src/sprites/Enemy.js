import Tile from './Tile'

export default class extends Tile {
  constructor ({ game, x, y, size, index, frame }) {
    super({ game, x, y, size, index, frame })
    this.hp = 4
    this.damage = 1
    this.armor = 1

    const hpText = game.add.text(0, 0, this.hp.toString())
    this.hpText = hpText
    hpText.padding.set(10, 16)
    hpText.fontSize = 14
    hpText.fill = '#ff0000'
    hpText.smoothed = false
    hpText.anchor.setTo(0.5)
    this.hpText.x = 65
    this.hpText.y = 70
    this.hpText.visible = this.frame === 0
    this.addChild(this.hpText)

    const damageText = game.add.text(0, 0, this.damage.toString())
    this.damageText = damageText
    damageText.padding.set(10, 16)
    damageText.fontSize = 14
    damageText.fill = '#ffffff'
    damageText.smoothed = false
    damageText.anchor.setTo(0.5)
    this.damageText.x = 65
    this.damageText.y = 20
    this.damageText.visible = this.frame === 0
    this.addChild(this.damageText)

    const armorText = game.add.text(0, 0, this.armor.toString())
    this.armorText = armorText
    armorText.padding.set(10, 16)
    armorText.fontSize = 14
    armorText.fill = '#eeeeee'
    armorText.smoothed = false
    armorText.anchor.setTo(0.5)
    this.armorText.visible = this.frame === 0
    this.armorText.x = 65
    this.armorText.y = 35
    this.addChild(this.armorText)
  }

  reset (index, type) {
    super.reset(index, type)
    if (type === 0) {
      this.damageText.visible = true
      this.armorText.visible = true
      this.hpText.visible = true
    }
  }

  destroy () {
    super.destroy()
  }
}
