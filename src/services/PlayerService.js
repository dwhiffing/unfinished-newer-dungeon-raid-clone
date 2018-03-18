import LevelService from './ExperienceService'
import CounterService from './CounterService'
import pick from 'lodash/pick'

// Responsible for:
// managing and updating player stats
// Relates to: DamageService

const GOLD_MULTI = 5
const UPGRADE_MULTI = 5
const XP_MULTI = 5
const INITIAL_WEAPON_DAMAGE = 3

export default class PlayerService {
  constructor (game) {
    this.game = game
  }

  init (
    save,
    updateStatsCallback,
    gameOverCallback,
    stateCallback,
    vibrateCallback
  ) {
    save = save || {}

    this.updateStatsCallback = updateStatsCallback
    this.vibrateCallback = vibrateCallback
    this.gameOverCallback = gameOverCallback
    this.stateCallback = stateCallback

    this.goldXpService = new LevelService(save.gold || GOLD_MULTI)
    this.upgradeXpService = new LevelService(save.upgrade || UPGRADE_MULTI)
    this.playerXpService = new LevelService(save.player || XP_MULTI)
    this.healthCounter = new CounterService(save.health || this.getBaseHealth())
    this.armorCounter = new CounterService(save.armor || this.getBaseArmor())
  }

  get health () {
    return this.healthCounter.value
  }

  set health (newHealth) {
    this.healthCounter.value = newHealth

    if (this.healthCounter.value === 0) {
      this.gameOverCallback()
    }

    this.updateStatsCallback(this.getStats())
  }

  get armor () {
    return this.armorCounter.value
  }

  set armor (newArmor) {
    this.armorCounter.value = newArmor
    this.updateXpService(this.upgradeXpService, this.armorCounter.overflow, 2)

    this.updateStatsCallback(this.getStats())
  }

  get baseDamage () {
    return this.playerXpService.level * 1
  }

  get weaponDamage () {
    return INITIAL_WEAPON_DAMAGE
  }

  get baseBonusChance () {
    return this.playerXpService.level * 0.025
  }

  get gold () {
    return this.goldXpService.totalXp
  }

  get experience () {
    return this.playerXpService.totalXp
  }

  set experience (newValue) {
    this.updateXpService(this.playerXpService, newValue, 2)
  }

  set gold (newValue) {
    this.updateXpService(
      this.goldXpService,
      this.goldXpService.totalXp + newValue,
      1
    )
  }

  update = ({ gold = 0, potion = 0, armor = 0, experience = 0 }) => {
    this.health += potion
    this.armor += armor

    this.gold += gold
    this.experience += experience

    this.updateStatsCallback(this.getStats())
  }

  takeDamage = (damage, type) => {
    if (type === 'armor') {
      this.vibrateCallback(50)
      this.armor -= damage
    } else if (type === 'health') {
      this.vibrateCallback(200)
      this.health -= damage
    }
  }

  updateXpService = (service, value, state) => {
    let levelBeforeChange = service.level
    service.xp = value

    if (levelBeforeChange !== service.level) {
      this.stateCallback(state)
      if (state === 2) {
        this.healthCounter.max = this.getBaseHealth()
        this.armorCounter.max = this.getBaseArmor()
      }
    }

    this.updateStatsCallback(this.getStats())
  }

  handleUpgrade = upgrade => {
    if (!upgrade) {
      return
    }

    if (upgrade.effect[0] === 'statIncrease') {
      this[upgrade.effect[1]] += upgrade.effect[2]
    }
  }

  getStats = () => ({
    baseDamage: this.baseDamage,
    armor: this.armorCounter,
    health: this.healthCounter,
    bonus: this.baseBonusChance,
    weaponDamage: this.weaponDamage,
    gold: this.goldXpService,
    player: this.playerXpService,
    upgrade: this.upgradeXpService
  })

  getSave = () => ({
    upgradeXp: pick(this.upgradeXpService, ['xpMultiplier', 'total']),
    goldXp: pick(this.goldXpService, ['xpMultiplier', 'total']),
    playerXp: pick(this.playerXpService, ['xpMultiplier', 'total']),
    health: pick(this.healthCounter, ['value', 'max', 'total']),
    armor: pick(this.armorCounter, ['value', 'max', 'total'])
  })

  getBaseArmor = () => 4 + this.playerXpService.level * 2
  getBaseHealth = () => this.playerXpService.level * 10
}
