export default class DamageService {
  constructor (gameService) {
    this.state = gameService.state
    const x = this.state.game.width
    const y = this.state.game.height

    this.graphics = this.state.game.add.graphics(0, 0)
    this.graphics.beginFill(0x000000)
    this.graphics.drawRect(0, 0, x, y)
    this.graphics.alpha = 0.5

    this.banner = this._initText(x / 2, y / 2, '1 DMG', '#ff0000', 40)
    this.banner.font = 'Bangers'

    this.clear()
  }

  update (n) {
    this.banner.text = n + ' DMG'
  }

  clear (n) {
    this.graphics.alpha = 0
    this.banner.text = ''
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
