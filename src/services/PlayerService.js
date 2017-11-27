// Barbarian - Can jump over tiles to hit more enemies/swords
// Paladin - Can bash with shield
// Thief - Gold speciality
// Druid - Potion speciality
// Wizard - Low damage to all enemies

export default class PlayerService {
  constructor (gameService) {
    this.game = window.game
    this.uiService = gameService.uiService
    this.tileService = gameService.tileService
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
      incomingArmor -= this.maxArmor - armor
      if (incomingArmor > 0) {
        this.upgrade += incomingArmor
        this._armor = this.maxArmor
      } else {
        this._armor = newArmor
      }
      return
    }

    let incomingDamage = this._armor - newArmor
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
  }

  damage (enemies) {
    let amount = 0
    enemies.forEach(e => {
      amount += e.damage
    })
    this.health -= amount
    return amount
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
      this.tileService.removeTile(tile.index)
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
            this.tileService.removeTile(tile.index)
          }
        }

        tile.updateUI()
      }
    })

    this.gold += gold
    this.health += potion
    this.armor += armor
    this.experience += experience
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
