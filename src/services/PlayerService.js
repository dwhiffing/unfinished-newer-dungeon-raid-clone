import items from '../data/items'
import upgrades from '../data/upgrades'
import skills from '../data/skills'

const datum = [items, upgrades, skills]
const titles = ['Shop!', 'Upgrade!', 'Level Up!']

// Barbarian - Can jump over tiles to hit more enemies/swords
// Paladin - Can bash with shield
// Thief - Gold speciality
// Druid - Potion speciality
// Wizard - Low damage to all enemies

export default class PlayerService {
  constructor () {
    this.game = window.game
    this.state = 0
  }

  init (gameService, data) {
    this.uiService = gameService.uiService
    this.tileService = gameService.tileService

    if (data) {
      this.data = data
    } else {
      this.data = {}

      this.data.level = 1
      this.data._totalExperience = 0
      this.data._experience = 0

      this.data.strength = 1
      this.data.dexterity = 1
      this.data.vitality = 1
      this.data.luck = 1
      this.data.items = [3, 2, 1, 1]

      this.data._totalArmor = 0
      this.data._armor = this.maxArmor
      this.data._totalUpgrades = 0
      this.data._upgradeProgress = 0

      this.data._totalGold = 0
      this.data._gold = 0
      this.data._totalItems = 0

      this.data._totalPotions = 0
      this.data._health = this.maxHealth
    }
  }

  set health (newHealth) {
    const change = newHealth - this.data._health
    if (change > 0) {
      this.data._totalPotions += change
    }
    this.data._health = newHealth
    if (this.data._health > this.maxHealth) {
      this.data._health = this.maxHealth
    }
    if (this.data._health <= 0) {
      this.game.state.start('GameOver')
      localStorage.removeItem('player')
      localStorage.removeItem('tile')
      this.data._health = 0
    }

    this.uiService.update()
  }

  set armor (newArmor) {
    const change = newArmor - this.data._armor
    if (change > 0) {
      this.data._totalArmor += change
    }
    if (newArmor > this.data._armor) {
      let incomingArmor = newArmor - this.data._armor
      let armor = this.data._armor
      this.data._armor += incomingArmor
      incomingArmor -= this.maxArmor - armor
      if (incomingArmor > 0) {
        this.upgrade += incomingArmor
        this.data._armor = this.maxArmor
      } else {
        this.data._armor = newArmor
      }
      return
    }

    let incomingDamage = this.data._armor - newArmor
    this.data._armor -= incomingDamage
    incomingDamage = 0

    if (this.data._armor < 0) {
      this.data._armor = 0
    }

    this.uiService.update()
  }

  set gold (newGold) {
    const change = newGold - this.data._gold
    if (change > 0) {
      this.data._totalGold += change
    }
    this.data._gold = newGold

    if (newGold >= this.maxGold) {
      this.data._totalItems++
      this.state = 1
      this.data._gold = 0
    }

    this.uiService.update()
  }

  set upgrade (newUpgrade) {
    this.data._upgradeProgress = newUpgrade
    if (this.data._upgradeProgress >= this.maxUpgrade) {
      this.data._totalUpgrades++
      this.upgrades++
      this.state = 2
      this.data._upgradeProgress = 0
    }

    this.uiService.update()
  }

  set experience (newExperience) {
    this.data._totalExperience += newExperience - this.data._experience
    this.data._experience = newExperience
    if (this.data._experience >= this.maxExperience) {
      this.data._totalUpgrades++
      this.state = 3
      this.data._experience = 0
    }

    this.uiService.update()
  }

  get health () {
    return this.data._health
  }

  get armor () {
    return this.data._armor
  }

  get gold () {
    return this.data._gold
  }

  get upgrade () {
    return this.data._upgradeProgress
  }

  get experience () {
    return this.data._experience
  }

  get maxHealth () {
    return 50 + 10 * this.data.dexterity - 10
  }

  get maxArmor () {
    return this.data.items[1] + this.data.items[2] + this.data.items[3]
  }

  get maxGold () {
    return 50 + 1 * this.data.luck - 1
  }

  get maxUpgrade () {
    return 50 + 1 * this.data.dexterity - 1
  }

  get maxExperience () {
    return 50 + 1 * this.data.level - 1
  }

  get baseDamage () {
    return 4 + this.data.strength * 1
  }

  get weaponDamage () {
    return this.data.items[0]
  }

  updateResources (tiles) {
    let gold = 0
    let potion = 0
    let armor = 0
    let experience = 0
    let sword = 0

    tiles.forEach(tile => {
      if (tile.frame === 0) {
        return
      }
      this.tileService.destroyTile(tile.index)
      if (tile.frame === 4) {
        gold++
      } else if (tile.frame === 3) {
        potion++
      } else if (tile.frame === 2) {
        armor++
      } else if (tile.frame === 1) {
        sword++
      }
    })

    tiles.forEach(tile => {
      if (tile.frame === 0) {
        tile.unpick()
        let totalDamage = this.baseDamage + this.weaponDamage * sword

        if (tile.armor - totalDamage < 0) {
          totalDamage -= tile.armor
          tile.armor = 0
        } else {
          tile.armor -= totalDamage
          return
        }

        if (totalDamage > 0) {
          tile.hp -= totalDamage

          if (tile.hp <= 0) {
            experience++
            this.tileService.destroyTile(tile.index)
          }
        }

        tile.updateUI()
      }
    })

    this.gold += gold
    this.health += potion
    this.armor += armor
    this.experience += experience

    this.uiService.update()
  }

  getStats () {
    return {
      gold: this.gold,
      maxGold: this.maxGold,
      health: this.health,
      maxHealth: this.maxHealth,
      armor: this.armor,
      maxArmor: this.maxArmor,
      base: this.baseDamage,
      weapon: this.weaponDamage,
      upgrade: this.upgrade,
      maxUpgrade: this.maxUpgrade,
      experience: this.experience,
      maxExperience: this.maxExperience
    }
  }

  getMenuState () {
    const data = datum[this.state - 1]
    const title = titles[this.state - 1]
    return data && title ? { data, title } : null
  }

  save () {
    localStorage.setItem('player', JSON.stringify(this.data))
  }

  // xp per kill
  // Bonus XP chance
  // Armor piercing
  // Armor per shield
  // Bonus armor chance
  // Armor durability
  // hp per potion
  // Bonus potion chance
  // gold per coin
  // Bonus coin chance
}
