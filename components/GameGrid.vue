<template lang="pug">
div.game-grid-wrapper
  transition-group(class='game-grid', name='grid-list', tag='div')
    template(v-for='(row, x) in game.grid')
      GridSlot(
        v-for='(item, y) in row',
        :key='item ? item.id : `${x}_${y}`',
        :content='item',
        :selected='selectedCell && selectedCell.x === x && selectedCell.y === y',
        @mousedown='handleMouseDown(x, y)',
        @mousemove='handleMouseMove(x, y)',
        @mouseup='handleMouseUp(x, y)'
      )
</template>

<script setup lang="ts">
import uuid from 'short-uuid'
import _ from 'lodash'

let selectedCell = ref(null)
let dragStartCell = ref(null)

watchEffect(() => console.log(selectedCell.value))

const size = 8

// check that two tiles are adjacent and swap them
const checkAdjacent = (a, b) => {
  // check if new selection is adjacent to previous
  const xDistance = Math.abs(a.x - b.x)
  const yDistance = Math.abs(a.y - b.y)
  if (
    (xDistance === 1 && yDistance === 0) ||
    (yDistance === 1 && xDistance === 0)
  )
    return true
  else return false
}

// set drag start cell
const handleMouseDown = (x, y) => {
  dragStartCell.value = { x, y }
}

// if drag moves over adjacent cell, swap and end drag
const handleMouseMove = (x, y) => {
  if (
    dragStartCell.value &&
    (dragStartCell.value.x !== x || dragStartCell.value.y !== y)
  ) {
    if (checkAdjacent({ x, y }, dragStartCell.value))
      game.swapTiles({ x, y }, dragStartCell.value)

    dragStartCell.value = null
    selectedCell.value = null
  }
}

// check if we single clicked, not dragged and clear drag event
const handleMouseUp = (x, y) => {
  if (dragStartCell.value.x === x && dragStartCell.value.y === y) {
    if (selectedCell.value) {
      if (checkAdjacent({ x, y }, selectedCell.value)) {
        game.swapTiles({ x, y }, selectedCell.value)
        selectedCell.value = null
      } else {
        selectedCell.value = { x, y }
      }
    } else {
      selectedCell.value = { x, y }
    }
  }

  dragStartCell.value = null
}

/* GAME MANAGER */
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

class Game {
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

      // this.resolveClusters()

      if (this.findAvailableMoves().length > 0) gameGridValid = true
    }
  }

  // clean up gem clusters and fill empty spaces
  resolveClusters = () => {
    const findClusters = () => {
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

    const removeClusters = () => {
      for (const cluster of this.clusters) {
        console.log(cluster)
        for (let i = 0; i < cluster.length; i++) {
          const x = cluster.column + (cluster.horizontal ? 0 : i)
          const y = cluster.row + (cluster.horizontal ? i : 0)

          this.grid[x].splice(y, 1)
          this.grid[x].unshift(new Tile())
        }
      }
    }

    // look for clusters
    findClusters()
    removeClusters()
    //   setTimeout(() => {
    //     this.shiftTiles()
    //   }, 1000)
    // while (this.clusters.length > 0) {
    //   findClusters()
    // }
  }

  // get a list of available moves
  findAvailableMoves = () => {
    return [1]
  }

  // shift tiles down to fill empty spaces
  shiftTiles = () => {
    for (let x = 0; x < this.size; x++) {
      let lowestEmptySpace = this.size - 1 // start at bottom of column
      for (let y = lowestEmptySpace; y >= 0; y--) {
        // check that tile is filled
        if (this.grid[x][y]) {
          // check if there's empty space below
          if (lowestEmptySpace > y) {
            this.swapTiles({ x, y }, { x, lowestEmptySpace })
            console.log(y, lowestEmptySpace)
          }

          lowestEmptySpace -= 1
        }
      }
    }
  }

  // swap tiles between two positions
  swapTiles = (a, b) => {
    const temp = this.grid[a.x][a.y]
    this.grid[a.x][a.y] = this.grid[b.x][b.y]
    this.grid[b.x][b.y] = temp
  }
}

const game = reactive(new Game(size))
</script>

<style lang="sass">
$grid-size: 20rem

.grid-list-move
  transition: transform 500ms

.game-grid
  display: grid
  grid-auto-flow: column
  grid-template-columns: repeat(8, 1fr)
  grid-template-rows: repeat(8, 1fr)
  grid-gap: 0.5rem

  height: $grid-size
  width: $grid-size

  &-wrapper
    display: flex
    flex-direction: column

  &-controls
    display: flex
    justify-content: space-between
    align-items: center

    margin-top: 1rem
</style>
