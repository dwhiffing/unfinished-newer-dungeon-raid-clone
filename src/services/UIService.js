export default class UIService {
  constructor (state) {
    const x = state.game.width
    const graphics = state.game.add.graphics(0, 0)
    graphics.beginFill(0x222222)
    graphics.drawRect(0, 0, x, 120)
    graphics.endFill()

    const y = state.game.height

    graphics.moveTo(0, y - 120)
    graphics.beginFill(0x222222)
    graphics.drawRect(0, y - 120, x, y)
    graphics.endFill()

    const banner = state.add.text(state.world.centerX, 60, 'Dungeon Raid')
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    const gold = state.add.text(70, state.game.height - 55, 'Gold: 0')
    gold.font = 'Bangers'
    gold.padding.set(10, 16)
    gold.fontSize = 32
    gold.fill = '#ffff00'
    gold.smoothed = false
    gold.anchor.setTo(0.5)

    const health = state.add.text(
      state.game.width - 70,
      state.game.height - 55,
      'Health: 0'
    )
    health.font = 'Bangers'
    health.padding.set(10, 16)
    health.fontSize = 32
    health.fill = '#ff0000'
    health.smoothed = false
    health.anchor.setTo(0.5)

    const armor = state.add.text(
      state.game.width / 2,
      state.game.height - 55,
      'Armor: 0'
    )
    armor.font = 'Bangers'
    armor.padding.set(10, 16)
    armor.fontSize = 32
    armor.fill = '#0000ff'
    armor.smoothed = false
    armor.anchor.setTo(0.5)

    this.texts = { gold, health, armor }
  }

  update ({ gold, health, armor }) {
    this.texts.gold.text = `Gold: ${gold}`
    this.texts.health.text = `Health: ${health}`
    this.texts.armor.text = `Armor: ${armor}`
  }
}
