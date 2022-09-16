<template lang="pug">
div(:style='cssVars')
  svg.waves(
    xmlns='http://www.w3.org/2000/svg',
    xmlns:xlink='http://www.w3.org/1999/xlink',
    viewbox='0 0 56 56',
    preserveaspectratio='none',
    shape-rendering='auto'
  )
    defs
      path#gentle-wave(
        d='M 0 5 c 30 0 50 -5 80 -5 s 50 5 80 5 s 50 -5 80 -5 s 50 5 80 5 v 60 h -320 z'
      )
    g.parallax
      use(xlink:href='#gentle-wave', :fill='hexToRgbA(color, 0.3)')
      use(xlink:href='#gentle-wave', :fill='hexToRgbA(color, 0.6)')
      use(xlink:href='#gentle-wave', :fill='hexToRgbA(color, 1)')
</template>

<script setup lang="ts">
import { hexToRgbA } from '~/assets/helpers'
const props = defineProps({
  color: String,
})

const cssVars = computed(() => ({
  '--color': props.color,
  '--animDelay': `${-10 * Math.random()}s`,
}))
</script>

<style scoped lang="sass">
.waves
  width: 100%
  height: 100%
  transform: translateY(-5px)

.parallax
  & > use
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite

  & > use:nth-child(1)
    animation-delay: var(--animDelay)
    animation-duration: 3s

  & > use:nth-child(2)
    animation-delay: calc(var(--animDelay) - 2s)
    animation-duration: 5s

  & > use:nth-child(3)
    animation-delay: calc(var(--animDelay) - 3s)
    animation-duration: 8s

@keyframes move-forever
  0%
    transform: translate3d(-160px, 0, 0)
  100%
    transform: translate3d(0, 0, 0)
</style>
