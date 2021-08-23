<template>
  <!-- formation -->
  <div class="col-12">
    <div class="row justify-center">
      <h4>Dream Lineup</h4>
    </div>
    <div class="row">
      <player-formation :wr1="$props.userInfo.analysis.favoriteWR" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DisplayedUserInfo } from '../models';
import PlayerFormation from 'src/components/v2/PlayerFormation.vue';

export default defineComponent({
  // name: 'ComponentName'
  components: { PlayerFormation },
  props: {
    userInfo: {
      type: Object as PropType<DisplayedUserInfo>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
h4 {
  margin-top: 0;
}
</style>
