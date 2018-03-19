import CounterService from './CounterService'
import pick from 'lodash/pick'

// Responsible for:
// managing and updating player stats
// Relates to: DamageService

export default class PlayerService {
  constructor (game) {
    this.game = game
  }

  init (save, updateCallback, deathCallback, stateCallback, vibrateCallback) {
    save = save || {}

    this.updateCallback = updateCallback
    this.vibrateCallback = vibrateCallback
    this.deathCallback = deathCallback
    this.stateCallback = stateCallback

    this.items = [
      {
        damage: 1
      },
      {
        shield: 2,
        armor: 4
      },
      {
        armor: 10
      },
      {
        heal: 2
      }
    ]

    const obj = {
      updateCallback: () => this.updateCallback(this.getStats())
    }

    const itemSave = save.item || { multiplier: 10 }
    const goldSave = save.gold || { multiplier: 10 }
    const expSave = save.exp || { multiplier: 10 }
    this.itemCounter = new CounterService(Object.assign({}, obj, itemSave))
    this.levelCounter = new CounterService(Object.assign({}, obj, expSave))
    this.goldCounter = new CounterService(Object.assign({}, obj, goldSave))

    const health = this.getBaseHealth()
    const armor = this.getBaseArmor()
    const healthSave = save.health || { value: health, max: health }
    const armorSave = save.armor || { value: armor, max: armor }
    this.healthCounter = new CounterService(Object.assign({}, obj, healthSave))
    this.armorCounter = new CounterService(Object.assign({}, obj, armorSave))
  }

  get health () {
    return this.healthCounter.finalValue
  }

  get armor () {
    return this.armorCounter.finalValue
  }

  get gold () {
    return this.goldCounter.xp
  }

  get experience () {
    return this.levelCounter.xp
  }

  get baseDamage () {
    return 4 + this.levelCounter.level * 1
  }

  get weaponDamage () {
    return this.items.reduce((s, n) => s + (n.damage || 0), 0)
  }

  get itemArmor () {
    return this.items.reduce((s, n) => s + (n.armor || 0), 0)
  }

  get baseBonusChance () {
    return this.levelCounter.level * 0.025 * 100
  }

  update = ({ gold = 0, potion = 0, armor = 0, experience = 0 }) => {
    this.healthCounter.update(potion, this.baseBonusChance)
    this.armorCounter.max = this.getBaseArmor()
    this.armorCounter.update(armor, this.baseBonusChance, () => {
      this.updateCounter(this.itemCounter, this.armorCounter.overflow, 1)
    })
    this.updateCounter(this.goldCounter, gold, 0)
    this.updateCounter(this.levelCounter, experience, 2)

    this.updateCallback(this.getStats())
  }

  takeDamage = (damage, type) => {
    if (type === 'armor') {
      this.vibrateCallback(50)
      this.armorCounter.update(-damage, this.baseBonusChance)
    } else if (type === 'health') {
      this.vibrateCallback(200)
      this.healthCounter.update(-damage, this.baseBonusChance, () => {
        this.healthCounter.value === 0 && this.deathCallback()
      })
    }
  }

  updateCounter = (counter, value, state) => {
    let levelBeforeChange = counter.level
    counter.update(value, this.baseBonusChance, () => {
      if (levelBeforeChange !== counter.level) {
        this.stateCallback(state)
        if (state === 2) {
          this.healthCounter.max = this.getBaseHealth()
          this.healthCounter.update(this.getBaseHealth(), 0)
          this.armorCounter.max = this.getBaseArmor()
          this.armorCounter.update(this.getBaseArmor(), 0)
        }
      }
    })
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
    gold: this.goldCounter,
    exp: this.levelCounter,
    item: this.itemCounter
  })

  getSave = () => ({
    item: pick(this.itemCounter, ['bonus', 'multiplier', 'total']),
    gold: pick(this.goldCounter, ['bonus', 'multiplier', 'total']),
    exp: pick(this.levelCounter, ['bonus', 'multiplier', 'total']),
    health: pick(this.healthCounter, ['value', 'max', 'total']),
    armor: pick(this.armorCounter, ['value', 'max', 'total'])
  })

  getBaseArmor = () => 4 + this.levelCounter.level * 2 + this.itemArmor
  getBaseHealth = () => 40 + this.levelCounter.level * 10
}
