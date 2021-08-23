<template>
  <q-img
    v-if="!imageLoadError"
    class="player-img"
    :src="getPlayerImageUrl($props.player.player?.player_id)"
    @error="imageLoadFailed()"
    loading="lazy"
  ></q-img>
  <q-img
    v-if="imageLoadError"
    class="player-img"
    src="~assets/player-placeholder.png"
    loading="lazy"
  ></q-img>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { FavoritePositionalPick } from '../models';
import { getPlayerImageUrl } from '../utils';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    player: {
      type: Object as PropType<FavoritePositionalPick>,
      required: true,
    },
  },

  setup() {
    const imageLoadError = ref(false);
    const imageLoadFailed = () => {
      imageLoadError.value = true;
    };

    return { getPlayerImageUrl, imageLoadError, imageLoadFailed };
  },
});
</script>


<style lang="scss" scoped>
@import 'src/css/app.scss';

.player-img {
  width: 75px;
  height: 75px;
  border: 3px solid $card-toggle-background;
  border-radius: 50%;

  background: center center / cover $accent-color;
  box-shadow: 0px 0px 9px 0px rgb(0 0 0 / 75%);
}
</style>
