import { sleep } from '~/assets/helpers'

const colors = ['blue', 'red', 'orange', 'green', 'pink', 'purple']

export class ManaPool {
  color
  player

  unlocked = ref(false)
  gemCharge = ref(0)
  slotRef = ref(null)

  constructor(player, color) {
    this.color = color
    this.player = player

    this.unlocked.value = true
  }

  setSlotRef = (slotRef) => {
    this.slotRef = slotRef
  }

  fill = (amount) => {
    this.gemCharge.value += amount

    if (this.gemCharge.value > this.player.maxMana)
      this.gemCharge.value = this.player.maxMana
  }

  cast = () => {
    if (this.gemCharge.value < this.player.maxMana) return

    this.gemCharge.value = 0
  }
}

export class Player {
  money = ref(0)
  level = 0
  maxMana = 10

  manaPools = reactive({})

  constructor() {
    for (const color of colors) {
      this.manaPools[color] = new ManaPool(this, color)
    }
  }

  collect = async (tile) => {
    await sleep(0.65 + tile.delay * 0.05)

    switch (tile.type) {
      case 'coin':
        this.money.value += 1
        break
      case 'gem':
        if (this.manaPools[tile.color].unlocked)
          this.manaPools[tile.color].fill(1)
        break
    }
  }
}
