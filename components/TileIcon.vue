<template lang="pug">
img.tile-icon(:src='iconSrc')
</template>

<script setup>
const props = defineProps({
  tile: Object,
})

const iconSrc = computed(() => {
  let iconName = ''
  switch (props.tile.type) {
    case 'gem':
      iconName = `jewel-${props.tile.color}`
      break
    case 'coin':
      iconName = 'coin'
      break
  }
  return `/icons/${iconName}.png`
})
</script>

<style lang="sass" scoped>
.tile-icon
  width: 100%
  height: 100%

  pointer-events: none
</style>
