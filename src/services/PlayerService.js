// Strength
// Base damage
// Weapon damage
// Current level
// Max level
// xp per kill
// Bonus XP chance
// xp to level
// Armor piercing

// Dexterity
// Current armor
// Max armor
// Armor per shield
// Bonus armor chance
// Excess Armor to upgrade
// Armor durability

// Vitality
// Current hp
// Max hp
// hp per potion
// Bonus potion chance

// Luck
// Current gold
// Max gold
// gold per coin
// Bonus coin chance

export default class PlayerService {
  constructor (gameService) {
    this.game = window.game

    this.uiService = gameService.uiService
  }

  set experience (v) {
    this._experience += v
    if (this._experience >= this.maxExperience) {
      this.level += 1
    }
  }

  get experience () {
    return this._experience
  }

  get maxExperience () {
    return 100 * (this.level + 1) + 10 * Math.pow(this.level, 2)
  }

  get maxUpgrade () {
    return 100 * (this.dexterity + 1) + 10 * Math.pow(this.dexterity, 2)
  }

  set health (v) {
    this._health = v
    if (this._health <= 0) {
      console.log('Game over!')
      this._health = 0
    }
    if (this._health > this.maxHealth) {
      this._health = this.maxHealth
    }
  }

  get health () {
    return this._health
  }

  get maxHealth () {
    return 50 + 10 * this.vitality
  }

  get maxGold () {
    return 50 + 1 * this.luck - 1
  }

  get baseDamage () {
    return 4 + this.strength * 1
  }

  get weaponDamage () {
    return this.items[0]
  }

  get maxArmor () {
    return this.items[1] + this.items[2] + this.items[3]
  }

  reset () {
    this.strength = 1
    this.level = 1
    this.vitality = 1
    this.dexterity = 1
    this.luck = 1

    this._experience = 0
    this._health = this.maxHealth
    this.upgrade = 0
    this.armor = 0
    this.gold = 0
    this.items = [3, 2, 1, 1]
  }

  damage (amount) {
    this.health -= amount
    this.updateUI()
  }

  updateResources (tiles) {
    tiles.forEach(tile => {
      if (tile.frame === 4) {
        this.gold++
      } else if (tile.frame === 3) {
        this.health++
      } else if (tile.frame === 2) {
        this.armor++
      }
    })

    this.updateUI()
  }

  updateUI () {
    this.uiService.update({
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
    })
  }
}
