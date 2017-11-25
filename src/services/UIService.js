export default class UIService {
  constructor (gameService) {
    const state = gameService.state
    const x = state.game.width
    const y = state.game.height

    const graphics = state.game.add.graphics(0, 0)
    graphics.beginFill(0x222222)
    graphics.drawRect(0, 0, x, 120)
    graphics.endFill()

    graphics.moveTo(0, 110)
    graphics.beginFill(0x888888)
    graphics.drawRect(0, 115, x, 5)
    graphics.endFill()

    graphics.moveTo(0, y - 115)
    graphics.beginFill(0x222222)
    graphics.drawRect(0, y - 115, x, y)
    graphics.endFill()

    graphics.moveTo(0, y - 110)
    graphics.beginFill(0x888888)
    graphics.drawRect(0, y - 115, x, 5)
    graphics.endFill()

    const banner = state.add.text(state.world.centerX, 60, 'Dungeon Raid')
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    const gold = state.add.text(70, state.game.height - 40, '0/50')
    gold.padding.set(10, 16)
    gold.fontSize = 32
    gold.fill = '#ffff00'
    gold.smoothed = false
    gold.anchor.setTo(0.5)

    const health = state.add.text(
      state.game.width - 70,
      state.game.height - 40,
      '50/50'
    )
    health.padding.set(10, 16)
    health.fontSize = 32
    health.fill = '#ff0000'
    health.smoothed = false
    health.anchor.setTo(0.5)

    const armor = state.add.text(
      state.game.width / 2,
      state.game.height - 70,
      '0/4'
    )
    armor.padding.set(10, 16)
    armor.fontSize = 18
    armor.fill = '#0000ff'
    armor.smoothed = false
    armor.anchor.setTo(0.5)

    const base = state.add.text(
      state.game.width / 2 - 60,
      state.game.height - 70,
      '+5'
    )
    base.padding.set(10, 16)
    base.fontSize = 18
    base.fill = '#ffffff'
    base.smoothed = false
    base.anchor.setTo(0.5)

    const weapon = state.add.text(
      state.game.width / 2 + 60,
      state.game.height - 70,
      '+3'
    )
    weapon.padding.set(10, 16)
    weapon.fontSize = 18
    weapon.fill = '#ffffff'
    weapon.smoothed = false
    weapon.anchor.setTo(0.5)

    const upgrade = state.add.text(
      state.game.width / 2,
      state.game.height - 40,
      '0/100'
    )
    upgrade.padding.set(10, 16)
    upgrade.fontSize = 24
    upgrade.fill = '#0000ff'
    upgrade.smoothed = false
    upgrade.anchor.setTo(0.5)

    const experience = state.add.text(
      state.game.width / 2,
      state.game.height - 10,
      '0/100'
    )
    experience.padding.set(10, 16)
    experience.fontSize = 24
    experience.fill = '#00ff00'
    experience.smoothed = false
    experience.anchor.setTo(0.5)

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
}
