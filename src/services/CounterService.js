// Responsible for:
// managing and updating HP/Armor things
// Relates to: PlayerService

export default class CounterService {
  constructor (param) {
    if (typeof param === 'object') {
      const { value = 0, max = 0, total = 0 } = param
      this._value = value
      this.max = max
      this.total = total
      this.overflow = 0
    } else if (typeof param === 'number') {
      this._value = param
      this.max = param
      this.total = 0
      this.overflow = 0
    }
  }

  set value (newValue) {
    this.overflow = 0

    const change = newValue - this._value
    if (change > 0) {
      this.total += change
    }

    this._value = newValue

    if (this._value > this.max) {
      this.overflow = this._value - this.max
      this._value = this.max
    }

    if (this._value <= 0) {
      this._value = 0
    }
  }

  get value () {
    return this._value
  }
}
