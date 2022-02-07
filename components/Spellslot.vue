<template lang="pug">
div.spellslot(:class='props.color')
  Waves
</template>

<script setup lang="ts">
const props = defineProps({
  color: String,
})
</script>

<style lang="sass">
// TODO: move this to variables
$spellslot-size: 3.5rem

.spellslot
  position: relative
  width: $spellslot-size
  height: $spellslot-size

  border-radius: 50%
  background-color: #eee

  overflow: hidden
</style>
