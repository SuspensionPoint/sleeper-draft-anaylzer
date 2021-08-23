<template>
  <div class="col">
    <div class="row no-wrap justify-center">
      <!-- WR1 -->
      <player-avatar :player="$props.wr1" />

      <!-- TE -->
      <div class="te-left">
        <player-avatar :player="$props.wr1" />
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
        <q-skeleton
          class="q-mx-sm avatar-size"
          type="QAvatar"
          animation="none"
        />
      </div>
      <!-- WR2 -->
      <player-avatar :player="$props.wr1" />
    </div>

    <!-- hidden row -->
    <div class="row no-wrap justify-center">
      <!-- WR -->
      <q-skeleton
        class="q-mx-xl q-mr-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- TE -->
      <q-skeleton
        class="q-mx-sm q-ml-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- OL -->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- OL -->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- OL / Center-->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        size="48px"
        square
        animation="fade"
      />
      <!-- OL -->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- OL -->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- TE -->
      <q-skeleton
        class="q-mx-sm q-mr-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- WR -->
      <q-skeleton
        class="q-mx-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
    </div>

    <!-- backfield -->
    <div class="row no-wrap justify-center">
      <!-- WR -->
      <q-skeleton
        class="q-mx-xl q-mr-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- TE -->
      <q-skeleton
        class="q-mx-sm q-ml-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- OL -->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- OL -->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- QB-->
      <div class="qb">
        <player-avatar :player="$props.wr1" />
      </div>
      <!-- RB -->
      <div class="rb">
        <player-avatar :player="$props.wr1" />
      </div>

      <!-- OL -->
      <q-skeleton
        class="q-mx-sm skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- TE -->
      <q-skeleton
        class="q-mx-sm q-mr-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
      <!-- WR -->
      <q-skeleton
        class="q-mx-xl skeleton-hidden"
        type="QAvatar"
        animation="none"
      />
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

.avatar-size {
  height: 75px;
  width: 75px;
}

.te-left {
  margin-left: 90px;
}

.te-right {
  margin-right: 90px;
}

.qb,
.rb {
  margin-left: 25px;
}
</style>
