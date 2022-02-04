<template lang="pug">
div.grid-slot(:class='{ selected }', :style='slotStyle')
  GemIcon.grid-slot-icon(v-if='content.type === "gem"', :color='content.color')
</template>

<script setup>
const props = defineProps({
  position: Object,
  content: Object,
  selected: Boolean,
})

const slotStyle = computed(() => ({
  'grid-column': props.position ? props.position.x + 1 : undefined,
  'grid-row': props.position ? props.position.y + 1 : undefined,
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
</style>
