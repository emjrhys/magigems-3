import uuid from 'short-uuid'
import _ from 'lodash'

const tileTypes = {
  gem: {
    spawnRate: 100,
    matchType: 'color',
  },
  coin: {
    spawnRate: 10,
    matchType: 'adjacent',
  },
  bomb: {
    spawnRate: 5,
    matchType: 'adjacent',
  },
}

const getRandomType = () => {
  // get types and weights in a better format
  const typesArray = Object.entries(tileTypes)
  const totalSpawnRate = typesArray.reduce((r, [_, el]) => r + el.spawnRate, 0)

  // roll for type
  const spawnRoll = Math.random() * totalSpawnRate

  // find our winner!
  let rateCounter = 0
  for (const [k, v] of typesArray) {
    rateCounter += v.spawnRate
    if (rateCounter >= spawnRoll) return k
  }
}

class Tile {
  id
  type
  color
  properties
  delay = 0
  activated = ref(false)

  constructor(type, colorOptions, delay = 0) {
    this.id = uuid.generate()
    this.delay = delay

    this.type = type
    this.properties = tileTypes[this.type]

    this.color = this.type === 'gem' ? _.sample(colorOptions) : undefined
  }

  activate = () => {
    this.activated.value = true
  }
}

export class Game {
  size
  player
  colorOptions

  grid
  clusters
  moveHistory = reactive([])

  constructor(player, options) {
    this.player = player

    this.size = options.size
    this.colorOptions = options.colors

    this.newGame()
  }

  newGame = () => {
    this.generateGameGrid()
  }

  generateGameGrid = () => {
    const initializeGrid = () => {
      this.grid = reactive(
        Array.from(Array(this.size), () =>
          reactive(
            Array.from(
              Array(this.size),
              () => new Tile(getRandomType(), this.colorOptions)
            )
          )
        )
      )
    }

    let gameGridValid = false
    while (!gameGridValid) {
      initializeGrid()

      this.findClusters()
      while (this.clusters.length > 0) {
        this.resolveClusters()
        this.findClusters()
      }

      if (this.findAvailableMoves().length > 0) gameGridValid = true
    }
  }

  // look for and update matches and update list
  findClusters = () => {
    this.clusters = []

    // look for vertical clusters
    for (let x = 0; x < this.size; x++) {
      let matchLength = 1
      for (let y = 0; y < this.size; y++) {
        let shouldCheckCluster = false

        // check the color of the next tile if we haven't reached the end or a gap
        if (
          y < this.size - 1 && // check we haven't reached the end
          this.grid[x][y] && // check that the current element exists (should always be true)
          this.grid[x][y].properties.matchType === 'color' && // check that this element can be matched
          this.grid[x][y].color === this.grid[x][y + 1].color // check that its color matches the next element
        ) {
          matchLength += 1
        } else {
          shouldCheckCluster = true
        }

        if (shouldCheckCluster) {
          if (matchLength >= 3) {
            this.clusters.push({
              row: y + 1 - matchLength,
              column: x,
              length: matchLength,
              horizontal: true,
            })
          }

          matchLength = 1
        }
      }
    }

    // look for horizontal clusters
    for (let y = 0; y < this.size; y++) {
      let matchLength = 1
      for (let x = 0; x < this.size; x++) {
        let shouldCheckCluster = false

        // check the color of the next tile if we haven't reached the end or a gap
        if (
          x < this.size - 1 && // check we haven't reached the end of the row
          this.grid[x][y] && // check that the current element exists (should always be true)
          this.grid[x][y].properties.matchType === 'color' && // check that this element can be matched
          this.grid[x][y].color === this.grid[x + 1][y].color // check that its color matches the next element
        ) {
          matchLength += 1
        } else {
          shouldCheckCluster = true
        }

        if (shouldCheckCluster) {
          if (matchLength >= 3) {
            this.clusters.push({
              row: y,
              column: x + 1 - matchLength,
              length: matchLength,
              horizontal: false,
            })
          }

          matchLength = 1
        }
      }
    }
  }

  // remove matches and replace tiles
  resolveClusters = () => {
    this.loopClusters((x, y) => {
      this.grid[x].splice(y, 1)
      this.grid[x].push(new Tile(getRandomType(), this.colorOptions))
    })
    this.clusters = []
  }

  // set status on all cluster tiles to animate before removing
  activateClusters = () => {
    this.loopClusters((x, y, i) => {
      this.grid[x][y].activate()
      this.grid[x][y].delay = i
      this.activateAdjacent(x, y)
    })
  }

  activateAdjacent = (x, y) => {
    // check left
    if (x > 0 && this.grid[x - 1][y].properties.matchType === 'adjacent')
      this.grid[x - 1][y].activate()

    // check right
    if (
      x < this.size - 1 &&
      this.grid[x + 1][y].properties.matchType === 'adjacent'
    )
      this.grid[x + 1][y].activate()

    // check down
    if (y > 0 && this.grid[x][y - 1].properties.matchType === 'adjacent')
      this.grid[x][y - 1].activate()

    // check up
    if (
      y < this.size - 1 &&
      this.grid[x][y + 1].properties.matchType === 'adjacent'
    )
      this.grid[x][y + 1].activate()
  }

  removeActivated = () => {
    for (let x = 0; x < this.size; x++) {
      let numInColumn = 0
      for (let y = this.size - 1; y >= 0; y--) {
        if (this.grid[x][y].activated) {
          const tile = this.grid[x].splice(y, 1)[0]
          this.player.collect(tile)

          this.grid[x].push(
            new Tile(getRandomType(), this.colorOptions, numInColumn)
          )

          numInColumn += 1
        }
      }
    }
  }

  loopClusters = (fn) => {
    let count = 0
    for (const cluster of this.clusters) {
      for (let i = cluster.length - 1; i >= 0; i--) {
        const x = cluster.column + (cluster.horizontal ? 0 : i)
        const y = cluster.row + (cluster.horizontal ? i : 0)

        fn(x, y, count, cluster)

        count++
      }
    }
  }

  // get a list of available moves
  findAvailableMoves = () => {
    return [1]
  }

  // swap tiles between two positions
  swapTiles = (a, b) => {
    this.moveHistory.push({ a, b })

    const temp = this.grid[a.x][a.y]
    this.grid[a.x][a.y] = this.grid[b.x][b.y]
    this.grid[b.x][b.y] = temp
  }

  undoMove = () => {
    // I know it's weird to do it this way, but it makes animation easier
    const lastMove = this.moveHistory.pop()
    this.swapTiles(lastMove.a, lastMove.b)
    this.moveHistory.pop()
  }

  // check for matches after making a move
  checkValidMatch = () => {
    this.findClusters()

    if (this.clusters.length > 0) return true
    else return false
  }
}
