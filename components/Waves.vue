<template lang="pug">
div
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
      use(
        xlink:href='#gentle-wave',
        x='0',
        y='0'
      )
      use(
        xlink:href='#gentle-wave',
        x='0',
        y='0'
      )
</template>

<style scoped lang="sass">
.waves
  // position: relative
  width: 100%
  height: 100%
  transform: translateY(12px)

.parallax
  & > use
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite

  & > use:nth-child(1)
    fill: rgba(#F94144, 0.8)
    animation-delay: -4s
    animation-duration: 3s

  & > use:nth-child(2)
    fill: #F94144
    animation-delay: -5s
    animation-duration: 5s

@keyframes move-forever
  0%
    transform: translate3d(-160px, 0, 0)
  100%
    transform: translate3d(0, 0, 0)
</style>
