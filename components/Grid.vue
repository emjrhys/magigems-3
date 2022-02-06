<template lang="pug">
div.grid-wrapper(:style='cssVars')
  transition-group(
    class='grid',
    name='grid-tile',
    tag='div',
    @enter='enter',
    @leave='leave'
  )
    template(v-for='(row, x) in game.grid')
      GridSlot(
        v-for='(item, y) in row',
        :key='item.id',
        :data-delay='item.dropDelay',
        :data-type='item.type',
        :data-color='item.color',
        :position='{ x, y }',
        :tile='item',
        :selected='selectedCell && selectedCell.x === x && selectedCell.y === y',
        @mousedown='handleMouseDown(x, y)',
        @mousemove='handleMouseMove(x, y)',
        @mouseup='handleMouseUp(x, y)'
      )
</template>

<script setup lang="ts">
import { gsap, Power2 } from 'gsap'
import MotionPathPlugin from 'gsap/MotionPathPlugin.js'
gsap.registerPlugin(MotionPathPlugin)

import { Game } from '~/assets/game-manager'
import { sleep, getElementPosition } from '~/assets/helpers'

const props = defineProps({
  game: Game,
  walletPosition: Object,
  spellslotPositions: Object,
})

const size = useState('size')

let selectedCell = ref(null)
let dragStartCell = ref(null)
let cascading = false

const swapAnimDuration = 0.3
const refillAnimDelay = 0.1
const refillAnimDuration = 0.25
const refillCheckDelay = 0.1
const tileCollectDelay = 0
const collectAnimDuration = 1

const enter = (el, done) => {
  const data = { ...el.dataset }
  gsap.from(el, {
    y: -200,
    duration: refillAnimDuration,
    delay: refillAnimDelay + data.delay * 0.05,
    onComplete: done,
  })
}

const leave = (el, done) => {
  const data = { ...el.dataset }
  const position = getElementPosition(el)
  let targetPosition = position
  let finalSize = 0.5

  if (data.type === 'coin') {
    targetPosition = props.walletPosition
    finalSize = 0.75
  } else if (data.type === 'gem') {
    targetPosition = props.spellslotPositions[data.color]
  }

  const destination = {
    x: targetPosition.x - position.x,
    y: targetPosition.y - position.y,
  }

  let path = [
    { x: 0, y: 0 },
    {
      x: 10 * (destination.x < 0 ? 1 : -1),
      y: 30 * (destination.y < 0 ? 1 : -1),
    },
    {
      x: -10 * (destination.x < 0 ? 1 : -1),
      y: 30 * (destination.y < 0 ? 1 : -1),
    },
    {
      x: destination.x,
      y: destination.y,
    },
  ]

  // TODO: clean this up
  if (data.type === 'coin') path.splice(1, 2)

  gsap
    .timeline({ onComplete: done })
    .to(
      el,
      {
        duration: collectAnimDuration,
        motionPath: {
          path: path,
          curviness: 1,
        },
        ease: Power2.easeIn,
      },
      0
    )
    .to(
      el,
      {
        scale: 1.5,
        duration: collectAnimDuration * 0.3,
      },
      0
    )
    .to(
      el,
      {
        scale: finalSize,
        duration: collectAnimDuration * 0.7,
      },
      collectAnimDuration * 0.3
    )
    .to(
      el,
      {
        opacity: 0,
        duration: collectAnimDuration * 0.1,
      },
      collectAnimDuration * 0.9
    )
}

// check if two tiles are adjacent
const checkAdjacent = (a, b) => {
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
  // can't make moves while matches are happening
  if (cascading) return

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
  cascading = true

  props.game.swapTiles(a, b)
  await sleep(swapAnimDuration)

  if (props.game.checkValidMatch()) {
    while (props.game.clusters.length > 0) {
      // activate matched tiles
      props.game.activateClusters()
      await sleep(tileCollectDelay)

      // clear matches and refill board
      props.game.removeActivated()
      await sleep(refillAnimDuration + refillAnimDelay + refillCheckDelay)

      // look for more matches
      props.game.findClusters()
    }
  } else {
    props.game.swapTiles(b, a)
  }
  cascading = false
}

const cssVars = computed(() => ({
  '--gridSize': size.value,
}))
</script>

<style lang="sass" scoped>
// tile swap animation
.grid-tile-move
  transition: transform 300ms

.grid-tile-leave-active
  position: absolute
  z-index: 100

.grid
  position: relative

  display: grid
  grid-template-columns: repeat(var(--gridSize), 1fr)
  grid-template-rows: repeat(var(--gridSize), 1fr)
  grid-gap: 0.5rem

  user-select: none

  &-wrapper
    display: flex
    flex-direction: column

    padding: 1rem

    background-color: #fff
    border-radius: 24px
    // box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.10) inset

    // overflow: hidden
</style>