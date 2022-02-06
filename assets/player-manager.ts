export class Player {
  money = ref(0)
  level = 0

  constructor() {}

  collect = (tile) => {
    switch (tile.type) {
      case 'coin':
        this.money.value += 1
        break
    }
  }
}
