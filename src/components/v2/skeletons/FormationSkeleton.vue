<template>
  <div class="col">
    <div class="row no-wrap justify-center">
      <!-- WR -->
      <q-skeleton class="q-mx-xl q-mr-xl" type="QAvatar" animation="fade" />
      <!-- TE -->
      <q-skeleton class="q-mx-sm q-ml-xl" type="QAvatar" animation="fade" />
      <!-- OL -->
      <q-skeleton class="q-mx-sm" type="QAvatar" animation="fade" />
      <!-- OL -->
      <q-skeleton class="q-mx-sm" type="QAvatar" animation="fade" />
      <!-- OL / Center-->
      <q-skeleton class="q-mx-sm" size="48px" square animation="fade" />
      <!-- OL -->
      <q-skeleton class="q-mx-sm" type="QAvatar" animation="fade" />
      <!-- OL -->
      <q-skeleton class="q-mx-sm" type="QAvatar" animation="fade" />
      <!-- TE -->
      <q-skeleton class="q-mx-sm q-mr-xl" type="QAvatar" animation="fade" />
      <!-- WR -->
      <q-skeleton class="q-mx-xl" type="QAvatar" animation="fade" />
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
      <q-skeleton class="q-mx-sm" type="QAvatar" animation="fade" />
      <!-- RB -->
      <q-skeleton class="q-mx-sm" type="QAvatar" animation="fade" />
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
import { defineComponent } from 'vue';
export default defineComponent({
  // name: 'ComponentName'
});
</script>

<style lang="scss">
@import 'src/css/app.scss';

.skeleton-hidden {
  background-color: $theme-sleeper-blue;
}
</style>
