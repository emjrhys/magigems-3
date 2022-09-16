<template lang="pug">
div.mana-pool(
  ref='manaPoolRef',
  :class='manaPoolClasses',
  :style='slotStyle',
  @click='handleClick'
)
  //- div.mana-pool-count(:style='countStyle') {{ currentCharge }}
  Waves.mana-pool-waves(:color='colorMap[manaPool.color]', :style='wavesStyle')
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { hexToRgbA } from '~/assets/helpers'

/* State, Props, and Refs */
const colorMap = useState('colorMap')

const props = defineProps({
  manaPool: Object,
})

const manaPoolRef = ref(null)

/* Computed Properties */
const unlocked = computed(() => props.manaPool.unlocked)

const currentCharge = computed(() => props.manaPool.gemCharge)
const chargePercent = computed(
  () => currentCharge.value / props.manaPool.player.maxMana
)

/* Methods */
const handleClick = () => {
  props.manaPool.cast()
}

/* Animation */
const timeline = gsap.timeline()
const pulseAnimDuration = 0.1

watch(currentCharge, (value, oldValue) => {
  if (value > oldValue) {
    timeline.progress(0)
    timeline.clear()
    timeline
      .to(
        manaPoolRef.value,
        {
          scale: 1.2,
          duration: pulseAnimDuration / 2,
        },
        0
      )
      .to(
        manaPoolRef.value,
        {
          scale: 1,
          duration: pulseAnimDuration / 2,
        },
        pulseAnimDuration
      )
  }
})

/* Computed Styles */
const manaPoolClasses = computed(() => [
  {
    unlocked: unlocked.value,
    ready: chargePercent.value >= 1,
  },
  props.manaPool.color,
])

const slotStyle = computed(() => ({
  'background-color': unlocked.value
    ? hexToRgbA(colorMap.value[props.manaPool.color], 0.2)
    : '#eee',
}))

const countStyle = computed(() => ({
  color: hexToRgbA(colorMap.value[props.manaPool.color], 1),
}))

const wavesStyle = computed(() => ({
  transform: `translateY(${45 * (1 - chargePercent.value)}px)`,
}))
</script>

<style lang="sass">
// TODO: move this to variables
$mana-pool-size: 2.5rem

.mana-pool
  position: relative
  width: $mana-pool-size
  height: $mana-pool-size

  border-radius: 50%
  background-color: #eee

  overflow: hidden

  transition: transform 150ms

  &.unlocked
    cursor: pointer

    &.ready
      &:hover
        transform: scale(1.1) !important

  &-count
    display: flex
    justify-content: center
    align-items: center

    height: 100%
    width: 100%

  &-waves
    position: absolute
    transition: transform 250ms
    top: 0
</style>
