<template lang="pug">
div.grid-slot(
  :class='[{ selected, activated: tile.activated }, props.tile.type]',
  :style='slotStyle'
)
  TileIcon.grid-slot-icon(:tile='tile')
</template>

<script setup>
const props = defineProps({
  position: Object,
  tile: Object,
  selected: Boolean,
})

const size = useState('size')

const slotStyle = computed(() => ({
  'grid-column-start': props.position ? props.position.x + 1 : undefined,
  'grid-column-end': props.position ? props.position.x + 1 : undefined,
  'grid-row-start': props.position ? size.value - props.position.y : undefined,
  'grid-row-end': props.position ? size.value - props.position.y : undefined,
}))
</script>

<style lang="sass">
$slot-size: 2.5rem

.grid-slot
  width: $slot-size
  height: $slot-size

  cursor: pointer

  filter: drop-shadow(0px 0px 3px red)

  &.selected
    background-color: #ddd

  &.activated
    // animation: coinCollect 150ms
    position: absolute

@keyframes gemCollect
  0%
    transform: scale(1)
    opacity: 1
  35%
    transform: scale(1.25)
    opacity: 1
  100%
    transform: scale(0.75)
    opacity: 0

@keyframes coinCollect
  0%
    transform: scale(1)
  100%
    transform: scale(1.25)
</style>
