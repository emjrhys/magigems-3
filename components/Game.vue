<template lang="pug">
div.game-wrapper
  div.game-grid
    Grid(:game='game', :wallet-position='walletPos')
  div.game-menu
    div.game-menu-wallet(ref='walletIcon')
      img.game-menu-wallet-icon(src='/icons/coin.png')
      p {{ player.money }}
</template>

<script setup lang="ts">
import { Player } from '~/assets/player-manager'
import { Game } from '~/assets/game-manager'

// UI stuff
const walletIcon = ref(null)
const walletPos = computed(() => walletIcon.value?.getBoundingClientRect())

// game stuff
const size = useState('size', () => 8)
const colors = useState('colors', () => [
  'blue',
  'red',
  'green',
  'pink',
  'purple',
  'orange',
])

const gameOptions = {
  colors: colors.value,
  size: size.value,
}

const player = reactive(new Player())
const game = reactive(new Game(player, gameOptions))
</script>

<style lang="sass">
.game
  &-wrapper
    display: flex
    flex-direction: column

    overflow: hidden

  &-menu
    display: flex
    justify-content: space-between
    align-items: center

    margin-top: 1rem

    &-wallet
      display: flex
      align-items: center

      width: 6rem
      padding: 0.5rem 0.75rem

      background-color: #fff
      border-radius: 2rem

      font-size: 1.35rem
      font-weight: 300


      &-icon
        position: relative
        top: -1px

        height: 2rem
        width: 2rem

        margin-right: 0.35rem
</style>
