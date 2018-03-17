export default class ExperienceService {
  constructor ({ xp = 0, xpMultiplier = 100 } = {}) {
    this.largestXp = 0
    this._xp = xp
    this.xpMultiplier = xpMultiplier
  }

  get xp () {
    return this._xp - this._xpForNextLevel(this.level - 1)
  }

  get totalXp () {
    return this._xp
  }

  set xp (n) {
    this._xp = n
    return this._xp
  }

  get level () {
    const level = Math.ceil(
      (Math.sqrt(1 + 8 * ((this._xp + 1) / this.xpMultiplier)) - 1) / 2
    )
    return level
  }

  get xpToNext () {
    return (
      this._xpForNextLevel(this.level) - this._xpForNextLevel(this.level - 1)
    )
  }

  _xpForNextLevel (level) {
    return level * (level + 1) / 2 * this.xpMultiplier
  }
}
