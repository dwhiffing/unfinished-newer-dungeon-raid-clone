import items from '../data/items'
import upgrades from '../data/upgrades'
import skills from '../data/skills'
import pick from 'lodash/pick'

const datum = [items, upgrades, skills]
const titles = ['Shop!', 'Upgrade!', 'Level Up!']

// Responsible for:
// managing and updating player stats
// Relates to: DamageService

// Barbarian - Can jump over tiles to hit more enemies/swords
// Paladin - Can bash with shield
// Thief - Gold speciality
// Druid - Potion speciality
// Wizard - Skill speciality

export default class PlayerService {
  constructor (game) {
    this.game = game
    this.state = 0
  }

  init (data, updateStatsCallback, gameOverCallback, vibrateCallback) {
    this.updateStatsCallback = updateStatsCallback
    this.gameOverCallback = gameOverCallback
    this.vibrateCallback = vibrateCallback

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
      this.data._health = 0
      this.gameOverCallback()
    }

    this.updateStatsCallback(this.getStats())
  }

  set armor (newArmor) {
    const previousArmor = this.data._armor
    let incomingArmor = newArmor - this.data._armor

    if (incomingArmor > 0) {
      this.data._totalArmor += incomingArmor
      this.data._armor += incomingArmor

      incomingArmor -= this.maxArmor - previousArmor

      if (incomingArmor > 0) {
        this.upgrade += incomingArmor
        this.data._armor = this.maxArmor
      }
    } else {
      this.data._armor -= this.data._armor - newArmor
      if (this.data._armor < 0) {
        this.data._armor = 0
      }
    }

    this.updateStatsCallback(this.getStats())
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
      this.vibrateCallback(200)
      this.data._gold = 0
    }

    this.updateStatsCallback(this.getStats())
  }

  set upgrade (newUpgrade) {
    this.data._upgradeProgress = newUpgrade
    if (this.data._upgradeProgress >= this.maxUpgrade) {
      this.data._totalUpgrades++
      this.upgrades++
      this.state = 2
      this.vibrateCallback(200)
      this.data._upgradeProgress = 0
    }

    this.updateStatsCallback(this.getStats())
  }

  set experience (newExperience) {
    this.data._totalExperience += newExperience - this.data._experience
    this.data._experience = newExperience
    if (this.data._experience >= this.maxExperience) {
      this.data._totalUpgrades++
      this.state = 3
      this.vibrateCallback(200)
      this.data._experience = 0
    }

    this.updateStatsCallback(this.getStats())
  }

  get gold () {
    // return this.goldXpService.xp
    return this.data._gold
  }

  get maxGold () {
    // return this.goldXpService.xpMultiplier
    return 50 + 1 * this.data.luck - 1
  }

  get health () {
    return this.data._health
  }

  get maxHealth () {
    return 50 + 10 * this.data.dexterity - 10
  }

  get armor () {
    return this.data._armor
  }

  get maxArmor () {
    return this.data.items[1] + this.data.items[2] + this.data.items[3]
  }

  get upgrade () {
    return this.data._upgradeProgress
  }

  get maxUpgrade () {
    return 50 + 1 * this.data.dexterity - 1
  }

  get experience () {
    return this.data._experience
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

  update ({ gold = 0, potion = 0, armor = 0, experience = 0 }) {
    this.gold += gold
    this.health += potion
    this.armor += armor
    this.experience += experience

    this.updateStatsCallback(this.getStats())
  }

  getStats () {
    return pick(this, [
      'gold',
      'maxGold',
      'numItems',
      'health',
      'maxHealth',
      'armor',
      'maxArmor',
      'baseDamage',
      'weaponDamage',
      'upgrade',
      'maxUpgrade',
      'experience',
      'maxExperience'
    ])
  }

  getMenuState () {
    const data = datum[this.state - 1]
    const title = titles[this.state - 1]
    return data && title ? { data, title } : null
  }
}
