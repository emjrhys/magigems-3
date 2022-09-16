<template lang="pug">
div.game-wrapper
  div.game-grid
    Grid(
      :game='game',
      :wallet-position='walletPosition',
      :mana-pool-positions='manaPoolPositions'
    )
  div.game-mana-pool-wrapper
    div.game-mana-pool(
      v-for='manaPool in player.manaPools',
      :ref='(el) => { if (el) manaPoolRefs[manaPool.color] = el; }'
    )
      ManaPool(:manaPool='manaPool')
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

const manaPoolRefs = ref({})
const manaPoolPositions = computed(() => {
  const positions = reactive({})
  for (const [color, el] of Object.entries(manaPoolRefs.value)) {
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

const colorMap = useState('colorMap', () => ({
  blue: '#009BF4',
  red: '#DF2935',
  orange: '#FF9C6B',
  green: '#77BA99',
  pink: '#FFB3CA',
  purple: '#A95BD6',
}))

const gameOptions = {
  colors: colors.value,
  size: size.value,
}

const player = reactive(new Player())
const game = reactive(new Game(player, gameOptions))
</script>

<style lang="scss">
.game {
  &-wrapper {
    display: grid;
    grid-template: "left  game  right ." auto
                   ".... bottom ..... ." 3rem
                   / 3.5rem auto 3.5rem;
    grid-gap: 1rem;

    overflow: hidden;
    user-select: none;
  }

  &-grid {
    grid-area: game;
  }

  &-mana-pool {
    &-wrapper {
      grid-area: right;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      height: 20rem;
      margin: auto 0; // I hate using this
      padding: 0.5rem;

      background-color: #fff;
      border-radius: 2rem;
    }
  }

  &-toolbar {
    grid-area: bottom;

    display: flex;
    justify-content: space-between;
    align-items: center;

    &-wallet {
      display: flex;
      align-items: center;

      width: 6rem;
      height: 3rem;
      padding-left: 0.5rem;

      background-color: #fff;
      border-radius: 1.5rem;

      font-size: 1.35rem;
      font-weight: 300;


      &-icon {
        position: relative;
        top: -1px;

        height: 32px;
        width: 32px;

        margin-right: 0.35rem;
      }
    }
  }
}
</style>
