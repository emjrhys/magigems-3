<template lang="pug">
component(:is='gemIcon', :style='iconStyle')
</template>

<script setup>
const props = defineProps({
  color: String,
})

import GemDiamond from '~/assets/icons/gem-diamond.svg'
import GemOctagon from '~/assets/icons/gem-octagon.svg'
import GemSquare from '~/assets/icons/gem-square.svg'
import GemStar from '~/assets/icons/gem-star.svg'
import GemTeardrop from '~/assets/icons/gem-teardrop.svg'
import GemTriangle from '~/assets/icons/gem-triangle.svg'

const iconMap = {
  blue: GemDiamond,
  red: GemSquare,
  green: GemTeardrop,
  yellow: GemStar,
  pink: GemTriangle,
  purple: GemOctagon,
}

const colorMap = {
  blue: '#546CB6',
  red: '#F66451',
  green: '#7BA06A',
  yellow: '#F5DD90',
  pink: '#FFC0CB',
  purple: '#90516D',
}

const gemIcon = computed(() => iconMap[props.color])
const iconStyle = computed(() => ({
  fill: colorMap[props.color],
}))
</script>

<style lang="sass">
.grid-slot
  cursor: pointer

  &.selected
    background-color: #ddd
</style>
