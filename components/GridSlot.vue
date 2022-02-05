<template lang="pug">
div.grid-slot(
  :class='{ selected, activated: tile.activated }',
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

const slotStyle = computed(() => ({
  'grid-column-start': props.position ? props.position.x + 1 : undefined,
  'grid-column-end': props.position ? props.position.x + 1 : undefined,
  'grid-row-start': props.position ? props.position.y + 1 : undefined,
  'grid-row-end': props.position ? props.position.y + 1 : undefined,
}))
</script>

<style lang="sass">
$slot-size: 2.5rem

.grid-slot
  width: $slot-size
  height: $slot-size

  cursor: pointer

  &.selected
    background-color: #ddd

  &.activated
    animation: collect 500ms
    position: absolute

@keyframes collect
  0%
    transform: scale(1)
    opacity: 1
  35%
    transform: scale(1.25)
    opacity: 1
  100%
    transform: scale(1)
    opacity: 0
</style>
