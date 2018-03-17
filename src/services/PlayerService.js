import ExperienceService from './ExperienceService'

// Responsible for:
// managing and updating player stats
// Relates to: DamageService

export default class PlayerService {
  constructor (game) {
    this.game = game
  }

  init (save, updateStatsCallback, gameOverCallback, stateCallback) {
    this.updateStatsCallback = updateStatsCallback
    this.gameOverCallback = gameOverCallback
    this.stateCallback = stateCallback

    if (save) {
      this.data = save
    } else {
      this.data = {}

      this.data.strength = 1
      this.data.dexterity = 1
      this.data.vitality = 1
      this.data.luck = 1
      this.data.items = [3, 2, 1, 1]

      this.data._totalArmor = 0
      this.data._armor = this.maxArmor

      this.data._totalPotions = 0
      this.data._health = this.maxHealth
    }

    this.goldXpService = new ExperienceService({
      xpMultiplier: 5,
      xp: this.data.goldXp || 0
    })

    this.upgradeXpService = new ExperienceService({
      xpMultiplier: 5,
      xp: this.data.upgradeXp || 0
    })

    this.playerXpService = new ExperienceService({
      xpMultiplier: 5,
      xp: this.data.playerXp || 0
    })
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
    let levelBeforeChange = this.goldXpService.level
    this.goldXpService.xp = newGold

    if (levelBeforeChange !== this.goldXpService.level) {
      this.stateCallback(1)
    }

    this.updateStatsCallback(this.getStats())
  }

  set upgrade (newUpgrade) {
    let levelBeforeChange = this.upgradeXpService.level
    this.upgradeXpService.xp = newUpgrade

    if (levelBeforeChange !== this.upgradeXpService.level) {
      this.stateCallback(2)
    }

    this.updateStatsCallback(this.getStats())
  }

  set experience (newExperience) {
    let levelBeforeChange = this.playerXpService.level
    this.playerXpService.xp = newExperience

    if (levelBeforeChange !== this.playerXpService.level) {
      this.stateCallback(3)
    }

    this.updateStatsCallback(this.getStats())
  }

  set strength (newStrength) {
    this.data.strength = newStrength
    this.updateStatsCallback(this.getStats())
  }

  set dexterity (newDexterity) {
    this.data.dexterity = newDexterity
    this.updateStatsCallback(this.getStats())
  }

  set vitality (newVitality) {
    this.data.vitality = newVitality
    this.updateStatsCallback(this.getStats())
  }

  set luck (newLuck) {
    this.data.luck = newLuck
    this.updateStatsCallback(this.getStats())
  }

  get strength () {
    return this.data.strength
  }

  get dexterity () {
    return this.data.dexterity
  }

  get vitality () {
    return this.data.vitality
  }

  get luck () {
    return this.data.luck
  }

  get health () {
    return this.data._health
  }

  get maxHealth () {
    return 10 + this.data.vitality * 10
  }

  get armor () {
    return this.data._armor
  }

  get maxArmor () {
    return (
      this.data.items[0] +
      this.data.items[1] +
      this.data.items[2] +
      this.data.items[3]
    )
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
    return 4 + this.data.strength * 1
  }

  get weaponDamage () {
    return this.data.items[0]
  }

  update ({ gold = 0, potion = 0, armor = 0, experience = 0 }) {
    this.health += potion
    this.armor += armor
    this.gold += gold
    this.experience += experience

    this.updateStatsCallback(this.getStats())
  }

  getStats () {
    return {
      health: this.health,
      maxHealth: this.maxHealth,
      armor: this.armor,
      maxArmor: this.maxArmor,
      baseDamage: this.baseDamage,
      weaponDamage: this.weaponDamage,
      gold: this.goldXpService,
      player: this.playerXpService,
      upgrade: this.upgradeXpService,
      strength: this.data.strength,
      dexterity: this.data.dexterity,
      vitality: this.data.vitality,
      luck: this.data.luck
    }
  }

  getSave () {
    return Object.assign({}, this.data, {
      playerXp: this.playerXpService.totalXp,
      goldXp: this.goldXpService.totalXp,
      upgradeXp: this.upgradeXpService.totalXp
    })
  }
}
