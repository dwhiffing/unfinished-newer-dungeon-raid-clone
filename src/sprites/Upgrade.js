export default class Upgrade {
  constructor ({ game, x, y, callback }) {
    this.game = game
    this.group = game.add.group()

    const box = game.add.sprite(0, 0, 'box')
    box.width = 55
    box.height = 55
    this.group.add(box)
    this.group.alpha = 0.4

    this.title = this._initText(x + 45, 0, 'title')
    this.description = this._initText(x + 45, 20, 'description')
    this.footer = this._initText(x + 45, 40, 'footer')

    const hitBox = game.add.sprite(0, 0, 'invisible-box')
    this.group.add(hitBox)
    hitBox.width = this.group.width
    hitBox.height = 55
    hitBox.inputEnabled = true
    hitBox.alpha = 0

    const self = this
    hitBox.events.onInputUp.add(() => {
      callback(self)
    })

    this.group.position = { x, y }
  }

  reset ({ title = '', description = '', footer = '' }) {
    this.title.text = title
    this.description.text = description
    this.footer.text = footer
  }

  select () {
    this.group.alpha = 1
  }

  deselect () {
    this.group.alpha = 0.4
  }

  _initText (x, y, text) {
    const textObj = this.game.add.text(x, y, text)
    textObj.fontSize = 12
    textObj.fill = '#ffffff'
    this.group.add(textObj)
    return textObj
  }
}
