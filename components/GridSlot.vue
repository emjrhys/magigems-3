<template lang="pug">
div.grid-slot(
  :class='{ selected, activated: content.activated }',
  :style='slotStyle'
)
  GemIcon.grid-slot-icon(v-if='content.type === "gem"', :color='content.color')
  CoinIcon.grid-slot-icon(v-else-if='content.type === "coin"')
</template>

<script setup>
const props = defineProps({
  position: Object,
  content: Object,
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
$slot-size: 2rem

.grid-slot
  width: 2rem
  height: 2rem

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
