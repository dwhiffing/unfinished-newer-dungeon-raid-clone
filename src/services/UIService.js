export default class UIService {
  constructor (state) {
    const x = state.game.height
    const graphics = state.game.add.graphics(0, 0)
    graphics.beginFill(0x222222)
    graphics.lineTo(x, 0)
    graphics.lineTo(x, 120)
    graphics.lineTo(0, 120)
    graphics.lineTo(0, 0)
    graphics.endFill()

    const y = state.game.height

    graphics.moveTo(0, y - 120)
    graphics.beginFill(0x222222)
    graphics.lineTo(x, y - 120)
    graphics.lineTo(x, y)
    graphics.lineTo(0, y)
    graphics.lineTo(0, y - 120)
    graphics.endFill()

    const bannerText = 'Dungeon Raid'
    const banner = state.add.text(state.world.centerX, 60, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)
  }
}
