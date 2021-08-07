<template>
  <q-card class="player-card" flat bordered>
    <q-img :src="getImageUrl(pickProp)" alt="Image not found" loading="lazy">
    </q-img>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { DisplayedPick } from './models';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    pick: Object as PropType<DisplayedPick>,
  },
  setup(props) {
    const pickProp = toRefs(props).pick;

    const getImageUrl = (pick: DisplayedPick | undefined): string => {
      const url = pick?.player_id;
      if (url) {
        return `https://sleepercdn.com/content/nfl/players/thumb/${url}.jpg`;
      }

      return '';
    };

    return { getImageUrl, pickProp };
  },
});
</script>

<style lang="scss">
.player-card {
  min-width: 45%;
}
</style>
