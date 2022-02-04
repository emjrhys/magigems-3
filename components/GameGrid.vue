<template lang="pug">
div.game-grid-wrapper
  transition-group(
    class='game-grid',
    name='grid-tile',
    tag='div',
    @enter='enter',
    @leave='leave'
  )
    template(v-for='(row, x) in game.grid')
      GridSlot(
        v-for='(item, y) in row',
        :key='item.id',
        :data-row='y',
        :data-column='x',
        :data-color='item.color',
        :position='{ x, y }',
        :content='item',
        :selected='selectedCell && selectedCell.x === x && selectedCell.y === y',
        @mousedown='handleMouseDown(x, y)',
        @mousemove='handleMouseMove(x, y)',
        @mouseup='handleMouseUp(x, y)'
      )
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

import { Game } from '~/assets/game-manager'
import { sleep } from '~/assets/helpers'

let selectedCell = ref(null)
let dragStartCell = ref(null)

watchEffect(() => console.log(selectedCell.value))

const size = 8
const game = reactive(new Game(size))

const collectAnimDuration = 0.65
const swapAnimDuration = 0.25
const refillAnimDuration = 0.25
const refillAnimDelay = 0.25

const enter = (el, done) => {
  gsap.from(el, {
    y: -50 - 50 * el.dataset.row,
    duration: refillAnimDuration,
    delay: refillAnimDelay + el.dataset.column * 0.05,
    onComplete: done,
  })
}

const leave = (el, done) => {
  gsap
    .timeline({ onComplete: done })
    // .to(
    //   el,
    //   {
    //     bottom: 0,
    //     left: '50%',
    //     duration: collectAnimDuration,
    //   },
    //   0
    // )
    .to(
      el,
      {
        scale: 1.25,
        duration: collectAnimDuration / 3,
      },
      0
    )
    .to(
      el,
      {
        scale: 0,
        opacity: 0,
        duration: (collectAnimDuration / 3) * 2,
      },
      collectAnimDuration / 3
    )
}

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
      handleSwap({ x, y }, dragStartCell.value)

    dragStartCell.value = null
    selectedCell.value = null
  }
}

// check if we single clicked, not dragged and clear drag event
const handleMouseUp = (x, y) => {
  // check if we've already swapped
  if (!dragStartCell.value) return

  if (dragStartCell.value.x === x && dragStartCell.value.y === y) {
    if (selectedCell.value) {
      if (checkAdjacent({ x, y }, selectedCell.value)) {
        handleSwap({ x, y }, selectedCell.value)
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

const handleSwap = async (a, b) => {
  game.swapTiles(a, b)
  await sleep(swapAnimDuration)

  if (game.checkValidMatch()) {
    while (game.clusters.length > 0) {
      game.resolveClusters()
      await sleep(refillAnimDuration + refillAnimDelay)
      game.findClusters()
    }
  } else {
    game.swapTiles(b, a)
  }
}
</script>

<style lang="sass">
$grid-size: 20rem

// tile swap animation
.grid-tile-move
  transition: transform 350ms

.grid-tile-enter-active, .grid-tile-leave-active
  position: absolute

.game-grid
  position: relative
  display: grid
  grid-template-columns: repeat(8, 1fr)
  grid-template-rows: repeat(8, 1fr)
  grid-gap: 0.5rem

  &-wrapper
    display: flex
    flex-direction: column

    padding: 1rem

    background-color: #fff
    border-radius: 1rem
    box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.1) inset

    overflow: hidden
</style>
