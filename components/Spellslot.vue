<template lang="pug">
div.spellslot(:class='color')
  Waves(:color='colorMap[color]')
</template>

<script setup lang="ts">
const props = defineProps({
  color: String,
})

const colorMap = useState('colorMap')
</script>

<style lang="sass">
// TODO: move this to variables
$spellslot-size: 2.5rem

.spellslot
  position: relative
  width: $spellslot-size
  height: $spellslot-size

  border-radius: 50%
  background-color: #eee

  overflow: hidden
  cursor: pointer

  transition: transform 150ms

  &:hover
    transform: scale(1.25)
</style>
