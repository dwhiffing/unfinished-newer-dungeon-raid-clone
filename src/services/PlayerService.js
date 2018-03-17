import LevelService from './ExperienceService'
import CounterService from './CounterService'
import pick from 'lodash/pick'

// Responsible for:
// managing and updating player stats
// Relates to: DamageService

const INITIAL_HEALTH = 50
const GOLD_MULTI = 5
const UPGRADE_MULTI = 5
const XP_MULTI = 5
const INITIAL_ARMOR = 7
const INITIAL_BASE_DAMAGE = 5
const INITIAL_WEAPON_DAMAGE = 3

export default class PlayerService {
  constructor (game) {
    this.game = game
  }

  init (
    save = {},
    updateStatsCallback,
    gameOverCallback,
    stateCallback,
    vibrateCallback
  ) {
    this.updateStatsCallback = updateStatsCallback
    this.vibrateCallback = vibrateCallback
    this.gameOverCallback = gameOverCallback
    this.stateCallback = stateCallback
    this.handleUpgrade = this.handleUpgrade.bind(this)
    this.takeDamage = this.takeDamage.bind(this)

    this.healthCounter = new CounterService(save.health || INITIAL_HEALTH)
    this.armorCounter = new CounterService(save.armor || INITIAL_ARMOR)
    this.goldXpService = new LevelService(save.gold || GOLD_MULTI)
    this.upgradeXpService = new LevelService(save.upgrade || UPGRADE_MULTI)
    this.playerXpService = new LevelService(save.player || XP_MULTI)
  }

  set health (newHealth) {
    this.healthCounter.value = newHealth

    if (this.healthCounter.value === 0) {
      this.gameOverCallback()
    }

    this.updateStatsCallback(this.getStats())
  }

  set armor (newArmor) {
    this.armorCounter.value = newArmor
    this.upgrade += this.armorCounter.overflow

    this.updateStatsCallback(this.getStats())
  }

  set gold (newValue) {
    this.updateXpService(this.goldXpService, newValue, 1)
  }

  set upgrade (newValue) {
    this.updateXpService(this.upgradeXpService, newValue, 2)
  }

  set experience (newValue) {
    this.updateXpService(this.playerXpService, newValue, 3)
  }

  get health () {
    return this.healthCounter.value
  }

  get maxHealth () {
    return this.healthCounter.max
  }

  get armor () {
    return this.armorCounter.value
  }

  get maxArmor () {
    return this.armorCounter.max
  }

  get upgrade () {
    return this.upgradeXpService.totalXp
  }

  get gold () {
    return this.goldXpService.totalXp
  }

  get experience () {
    return this.playerXpService.totalXp
  }

  get baseDamage () {
    return INITIAL_BASE_DAMAGE
  }

  get weaponDamage () {
    return INITIAL_WEAPON_DAMAGE
  }

  update ({ gold = 0, potion = 0, armor = 0, experience = 0 }) {
    this.health += potion
    this.armor += armor
    this.gold += gold
    this.experience += experience

    this.updateStatsCallback(this.getStats())
  }

  takeDamage (damage, type) {
    if (type === 'armor') {
      this.vibrateCallback(50)
      this.armor -= damage
    } else if (type === 'health') {
      this.vibrateCallback(200)
      this.health -= damage
    }
  }

  updateXpService (service, value, state) {
    let levelBeforeChange = service.level
    service.xp = value

    if (levelBeforeChange !== service.level) {
      this.stateCallback(state)
    }

    this.updateStatsCallback(this.getStats())
  }

  handleUpgrade (upgrade) {
    if (!upgrade) {
      return
    }

    if (upgrade.effect[0] === 'statIncrease') {
      this[upgrade.effect[1]] += upgrade.effect[2]
    }
  }

  getStats () {
    return {
      health: this.healthCounter.value,
      maxHealth: this.healthCounter.max,
      armor: this.armorCounter.value,
      maxArmor: this.armorCounter.max,
      baseDamage: this.baseDamage,
      weaponDamage: this.weaponDamage,
      gold: this.goldXpService,
      player: this.playerXpService,
      upgrade: this.upgradeXpService
    }
  }

  getSave () {
    return {
      upgradeXp: pick(this.upgradeXpService, ['xpMultiplier', 'total']),
      goldXp: pick(this.goldXpService, ['xpMultiplier', 'total']),
      playerXp: pick(this.playerXpService, ['xpMultiplier', 'total']),
      health: pick(this.healthCounter, ['value', 'max', 'total']),
      armor: pick(this.armorCounter, ['value', 'max', 'total'])
    }
  }
}
