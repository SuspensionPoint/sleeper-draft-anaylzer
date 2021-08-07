<template>
  <q-card class="player-card" flat bordered>
    <q-img
      class="img-transparent"
      :src="getImageUrl(playerToPickHistoryProp[0].player_id)"
      alt="Image not found"
      loading="lazy"
    >
    </q-img>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { DisplayedPick } from './models';
import { Player } from 'src/api';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    playerToPickHistory: {
      type: Object as PropType<[Player, DisplayedPick[]]>,
      required: true,
    },
  },
  setup(props) {
    const playerToPickHistoryProp = toRefs(props).playerToPickHistory;

    const getImageUrl = (playerId: string | undefined): string => {
      if (playerId) {
        return `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`;
      }

      return '';
    };

    return { getImageUrl, playerToPickHistoryProp };
  },
});
</script>

<style lang="scss">
.player-card {
  min-width: 45%;
  background-color: transparent;
  border: none;

  .img-transparent {
    background: center center / cover transparent;
  }
}
</style>
