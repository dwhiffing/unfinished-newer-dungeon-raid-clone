// Barbarian - Can jump over tiles to hit more enemies/swords
// Paladin - Can bash with shield
// Thief - Gold speciality
// Druid - Potion speciality
// Wizard - Low damage to all enemies

export default class PlayerService {
  constructor (gameService) {
    this.game = window.game
    this.uiService = gameService.uiService
  }

  get experience () {
    return this._experience
  }

  set experience (newExperience) {
    this._experience = newExperience
    if (this._experience >= this.maxExperience) {
      this.level += 1
      console.log('Level up!')
    }
  }

  get maxExperience () {
    return 50 + 1 * this.level - 1
  }

  get upgrade () {
    return this._upgrade
  }

  set upgrade (newUpgrade) {
    this._upgrade = newUpgrade
    if (this._upgrade >= this.maxUpgrade) {
      console.log('Upgrade!')
    }
  }

  get maxUpgrade () {
    return 50 + 1 * this.dexterity - 1
  }

  get health () {
    return this._health
  }

  set health (newHealth) {
    if (newHealth > this._health) {
      console.log('healing player for', newHealth - this._health)
      this._health = newHealth
      if (this._health > this.maxHealth) {
        this._health = this.maxHealth
      }
      return
    }

    let incomingDamage = this._health - newHealth
    if (this.armor > 0) {
      let armor = this.armor
      this.armor -= incomingDamage
      incomingDamage -= armor
    }

    if (incomingDamage > 0) {
      console.log('damaging player for', incomingDamage)
      this._health -= incomingDamage
      if (this._health <= 0) {
        console.log('Game over!')
        this._health = 0
      }
    }
  }

  get maxHealth () {
    return 50 + 10 * this.dexterity - 10
  }

  get armor () {
    return this._armor
  }

  set armor (newArmor) {
    if (newArmor > this._armor) {
      let incomingArmor = newArmor - this._armor
      let armor = this._armor
      this._armor += incomingArmor
      console.log('healing player armor', armor, incomingArmor, this._armor)
      incomingArmor -= this.maxArmor - armor
      if (incomingArmor > 0) {
        console.log('upgrading player for', incomingArmor)
        this.upgrade += incomingArmor
        this._armor = this.maxArmor
      } else {
        this._armor = newArmor
      }
      return
    }

    let incomingDamage = this._armor - newArmor
    console.log('damaging armor for', incomingDamage)
    this._armor -= incomingDamage
    incomingDamage = 0

    if (this._armor < 0) {
      this._armor = 0
    }
  }

  get maxArmor () {
    return this.items[1] + this.items[2] + this.items[3]
  }

  get gold () {
    return this._gold
  }

  set gold (newGold) {
    this._gold = newGold
    if (newGold > this.maxGold) {
      this._gold = this.maxGold
    }

    if (newGold > this.maxGold) {
      console.log('New Item!!')
      this._gold = 0
    }
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

  reset () {
    this.strength = 1
    this.level = 1
    this.vitality = 1
    this.dexterity = 1
    this.luck = 1
    this.items = [3, 2, 1, 1]

    this._experience = 0
    this._health = this.maxHealth
    this._armor = this.maxArmor
    this._upgrade = 0
    this._gold = 0
    this.updateUI()
  }

  damage (enemies) {
    let amount = 0
    enemies.forEach(e => {
      amount += e.damage
    })
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
      } else if (tile.frame === 0) {
        this.experience++
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
