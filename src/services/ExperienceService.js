export default class ExperienceService {
  constructor (param) {
    this.largestXp = 0

    if (typeof param === 'object') {
      const { xpMultiplier = 100, total = 0 } = param
      this.total = total
      this.xpMultiplier = xpMultiplier
    } else if (typeof param === 'number') {
      this.xpMultiplier = param
      this.total = 0
    }
  }

  get xp () {
    return this.total - this.xpForNextLevel(this.level - 1)
  }

  get totalXp () {
    return this.total
  }

  set xp (n) {
    this.total = n
    return this.total
  }

  get level () {
    const level = Math.ceil(
      (Math.sqrt(1 + 8 * ((this.total + 1) / this.xpMultiplier)) - 1) / 2
    )
    return level
  }

  get xpToNext () {
    return this.xpForNextLevel(this.level) - this.xpForNextLevel(this.level - 1)
  }

  xpForNextLevel (level) {
    return level * (level + 1) / 2 * this.xpMultiplier
  }
}
