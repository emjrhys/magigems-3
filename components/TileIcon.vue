<template lang="pug">
div.tile-icon-wrapper(:class='tile.type', :style='cssVars')
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

const shineInterval = 10

const cssVars = computed(() => ({
  '--animationDuration': `${shineInterval}s`,
  '--animationDelay': `${Math.random() * shineInterval}s`,
}))
</script>

<style scoped lang="sass">
.tile-icon
  width: 100%
  height: 100%

  &-wrapper
    pointer-events: none
    overflow: hidden
    position: relative

    &.coin::after
      content: ''
      position: absolute

      width: 50%
      height: 120%
      opacity: 0
      transform: rotate(45deg)

      background: #fff

      animation: shine var(--animationDuration) linear var(--animationDelay) infinite

@keyframes shine
  0%
    opacity: 0.65
    top: -80%
    left: -50%

  5%, 100%
    opacity: 0
    top: 50%
    left: 80%
</style>
