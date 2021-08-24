<template>
  <div class="col">
    <div class="row no-wrap justify-center">
      <!-- WR1 -->
      <div>
        <player-avatar class="justify-center" :player="$props.wr1" />
        <p class="text-underline text-center q-mt-sm">
          {{ $props.wr1.player?.first_name }} <br />
          {{ $props.wr1.player?.last_name }}
        </p>
      </div>

      <!-- TE -->
      <div class="te-left">
        <player-avatar class="justify-center" :player="$props.wr1" />
        <p class="text-underline text-center q-mt-sm">
          {{ $props.wr1.player?.first_name }} <br />
          {{ $props.wr1.player?.last_name }}
        </p>
      </div>
      <!-- OL -->
      <q-skeleton class="q-mx-sm avatar-size" type="QAvatar" animation="none" />
      <!-- OL -->
      <q-skeleton class="q-mx-sm avatar-size" type="QAvatar" animation="none" />
      <!-- OL / Center-->
      <q-skeleton class="q-mx-sm avatar-size" square animation="none" />
      <!-- OL -->
      <q-skeleton class="q-mx-sm avatar-size" type="QAvatar" animation="none" />
      <!-- OL -->
      <q-skeleton class="q-mx-sm avatar-size" type="QAvatar" animation="none" />
      <!-- TE -->
      <div class="te-right">
        <q-skeleton class="q-mx-sm avatar-size" type="QAvatar" animation="none">
        </q-skeleton>
      </div>
      <!-- WR2 -->
      <q-skeleton class="q-mx-sm avatar-size" type="QAvatar" animation="none">
      </q-skeleton>
    </div>

    <!-- hidden row -->
    <div class="row no-wrap justify-center">
      <!-- WR1 -->
      <div>
        <q-skeleton
          class="avatar-size skeleton-hidden"
          type="QAvatar"
          animation="none"
        />
      </div>

      <div class="te-left">
        <q-skeleton
          class="avatar-size skeleton-hidden"
          type="QAvatar"
          animation="none"
        />
      </div>
      <q-skeleton
        class="q-mx-sm avatar-size skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <q-skeleton
        class="q-mx-sm avatar-size skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- QB -->
      <div class="q-mx-sm">
        <player-avatar class="justify-center" :player="$props.wr1" />
        <p class="text-underline text-center q-mt-sm">
          {{ $props.wr1.player?.first_name }} <br />
          {{ $props.wr1.player?.last_name }}
        </p>
      </div>
      <!-- RB -->
      <div class="q-mx-sm">
        <player-avatar class="justify-center" :player="$props.wr1" />
        <p class="text-underline text-center q-mt-sm">
          {{ $props.wr1.player?.first_name }} <br />
          {{ $props.wr1.player?.last_name }}
        </p>
      </div>
      <q-skeleton
        class="q-mx-sm avatar-size skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <div class="te-right">
        <q-skeleton
          class="q-mx-sm avatar-size skeleton-hidden"
          type="QAvatar"
          animation="none"
        >
        </q-skeleton>
      </div>
      <q-skeleton
        class="q-mx-sm avatar-size skeleton-hidden"
        type="QAvatar"
        animation="none"
      >
      </q-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FavoritePositionalPick } from '../models';
import PlayerAvatar from './PlayerAvatar.vue';

export default defineComponent({
  // name: 'ComponentName'
  components: { PlayerAvatar },
  props: {
    wr1: {
      type: Object as PropType<FavoritePositionalPick>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'src/css/app.scss';

h5 {
  margin: 0;
}

.avatar-size {
  height: 75px;
  min-width: 75px;
}

.skeleton-hidden {
  background-color: transparent;
}

.te-left {
  margin-left: 90px;
}

.te-right {
  margin-right: 90px;
}
</style>
