<template lang="pug">
div.game-wrapper__outer
  div.game-wrapper__inner
    div.game-grid
      Grid(
        :game='game',
        :wallet-position='walletPosition',
        :spellslot-positions='spellslotPositions'
      )
    div.game-spellslot-wrapper
      div.game-spellslot(
        v-for='color in colors',
        :ref='(el) => { if (el) spellslotRefs[color] = el; }'
      )
        Spellslot(:color='color')
  div.game-toolbar
    div.game-toolbar-wallet
      img.game-toolbar-wallet-icon(ref='walletIconRef', src='/icons/coin.png')
      p {{ player.money }}
</template>

<script setup lang="ts">
import { Player } from '~/assets/player-manager'
import { Game } from '~/assets/game-manager'

import { getElementPosition } from '~/assets/helpers'

// UI stuff
const walletIconRef = ref(null)
const walletPosition = computed(() =>
  walletIconRef.value ? getElementPosition(walletIconRef.value) : undefined
)

const spellslotRefs = ref({})
const spellslotPositions = computed(() => {
  const positions = reactive({})
  for (const [color, el] of Object.entries(spellslotRefs.value)) {
    positions[color] = getElementPosition(el)
  }
  return positions
})

// game stuff
const size = useState('size', () => 9)
const colors = useState('colors', () => [
  'blue',
  'red',
  'orange',
  'green',
  'pink',
  'purple',
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
    &__outer
      display: flex
      flex-direction: column

      // overflow: hidden

    &__inner
      display: flex

  &-spellslot
    &-wrapper
      display: flex
      flex-direction: column
      justify-content: space-between
      align-items: center

      margin-left: 1rem
      padding: 0.5rem 0

  &-toolbar
    display: flex
    justify-content: space-between
    align-items: center

    margin-top: 1rem

    &-wallet
      display: flex
      align-items: center

      width: 6rem
      height: 3rem
      padding-left: 0.5rem

      background-color: #fff
      border-radius: 1.5rem

      font-size: 1.35rem
      font-weight: 300


      &-icon
        position: relative
        top: -1px

        height: 32px
        width: 32px

        margin-right: 0.35rem
</style>
