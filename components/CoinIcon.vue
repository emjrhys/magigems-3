<template lang="pug">
Coin(:style='iconStyle')
</template>

<script setup>
import Coin from '~/assets/icons/coin.svg'

const iconStyle = computed(() => ({
  fill: '#F3A712',
}))
</script>
