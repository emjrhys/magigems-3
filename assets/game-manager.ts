import uuid from 'short-uuid'
import _ from 'lodash'

const colors = ['blue', 'red', 'green', 'yellow', 'pink', 'purple']

class Tile {
  id
  type
  color

  constructor() {
    this.id = uuid.generate()
    this.type = 'gem'
    this.color = _.sample(colors)
  }

  empty = () => {
    this.type = null
    this.color = null
  }
}

export class Game {
  size
  grid
  clusters

  constructor(size = 8) {
    this.size = size

    this.newGame()
  }

  newGame = () => {
    this.generateGameGrid()
  }

  generateGameGrid = () => {
    const initializeGrid = () => {
      this.grid = reactive(
        Array.from(Array(this.size), () =>
          reactive(Array.from(Array(this.size), () => new Tile()))
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

    // look for clusters on the Y-axis
    for (let x = 0; x < this.size; x++) {
      let matchLength = 1
      for (let y = 0; y < this.size; y++) {
        let shouldCheckCluster = false

        // check the color of the next tile if we haven't reached the end or a gap
        if (
          y < this.size - 1 &&
          this.grid[x][y] &&
          this.grid[x][y].color === this.grid[x][y + 1].color
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

    // look for clusters on the X-axis
    for (let y = 0; y < this.size; y++) {
      let matchLength = 1
      for (let x = 0; x < this.size; x++) {
        let shouldCheckCluster = false

        // check the color of the next tile if we haven't reached the end or a gap
        if (
          x < this.size - 1 &&
          this.grid[x][y] &&
          this.grid[x][y].color === this.grid[x + 1][y].color
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
      this.grid[x].unshift(new Tile())
    })
    this.clusters = []
  }

  loopClusters = (fn) => {
    for (const cluster of this.clusters) {
      for (let i = 0; i < cluster.length; i++) {
        const x = cluster.column + (cluster.horizontal ? 0 : i)
        const y = cluster.row + (cluster.horizontal ? i : 0)

        fn(x, y)
      }
    }
  }

  // get a list of available moves
  findAvailableMoves = () => {
    return [1]
  }

  // swap tiles between two positions
  swapTiles = (a, b) => {
    const temp = this.grid[a.x][a.y]
    this.grid[a.x][a.y] = this.grid[b.x][b.y]
    this.grid[b.x][b.y] = temp
  }

  // check for matches after making a move
  checkValidMatch = () => {
    this.findClusters()

    if (this.clusters.length > 0) return true
    else return false
  }
}
