// Responsible for:
// managing and updating HP/Armor things
// Relates to: PlayerService

export default class CounterService {
  constructor ({
    value = 0,
    max = 0,
    total = 0,
    bonus = 0,
    multiplier,
    updateCallback
  }) {
    this.value = value
    this.finalValue = value
    this.max = max
    this.bonus = bonus
    this.total = total
    this.multiplier = multiplier
    this.updateCallback = updateCallback
    this.overflow = 0
  }

  set max (newValue) {
    this._max = newValue
  }

  get max () {
    return this._max
  }

  get xp () {
    return this.total - this.xpForNextLevel(this.level - 1)
  }

  get level () {
    const level = Math.ceil(
      (Math.sqrt(1 + 8 * ((this.total + 1) / this.multiplier)) - 1) / 2
    )
    return level
  }

  update = (change, bonusChance, callback) => {
    this.callback = callback
    this.finalValue += change
    this.overflow = 0

    if (typeof this.multiplier !== 'number' && this.finalValue > this.max) {
      this.overflow = this.finalValue - this.max
      this.finalValue = this.max
    }

    if (this.finalValue <= 0) {
      this.finalValue = 0
    }

    this.bonusChance = bonusChance
    this.count()
  }

  count = () => {
    if (this.value === this.finalValue) {
      this.callback && this.callback()
      return
    }
    if (this.finalValue > this.value) {
      const change = this.getBonusChance(this.bonusChance) ? 2 : 1
      this.value += change
      this.total += change
    } else if (this.finalValue < this.value) {
      this.value--
    }
    this.updateCallback()
    if (this.finalValue !== this.value) {
      setTimeout(this.count, 100)
    } else {
      this.callback && this.callback()
    }
  }

  get toNext () {
    return this.xpForNextLevel(this.level) - this.xpForNextLevel(this.level - 1)
  }

  xpForNextLevel (level) {
    return level * (level + 1) / 2 * this.multiplier
  }

  getBonusChance = bonus => {
    return window.game.rnd.integerInRange(0, 100) <= bonus
  }
}
