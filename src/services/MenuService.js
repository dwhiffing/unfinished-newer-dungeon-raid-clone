import items from '../data/items'
import upgrades from '../data/upgrades'
import skills from '../data/skills'
import Menu from '../sprites/Menu'

const datum = [items, upgrades, skills]
const titles = ['Shop!', 'Upgrade!', 'Level Up!']

// Responsible for:
// managing and updating menu state
// Relates to: DamageService

export default class MenuService {
  constructor (game) {
    this.game = game
    this.state = 0
    this.menu = new Menu(this.game, this.game.width / 2, this.game.height / 2)
  }

  setState (n) {
    this.state = n
  }

  show () {
    return new Promise(resolve => {
      const menu = this.getMenu()
      if (menu) {
        this.state = 0
        this.menu.show({
          data: menu.data,
          title: menu.title,
          callback: upgrade => resolve(upgrade)
        })
      } else {
        resolve(false)
      }
    })
  }

  getMenu () {
    const data = datum[this.state - 1]
    const title = titles[this.state - 1]
    return data && title ? { data, title } : null
  }
}
