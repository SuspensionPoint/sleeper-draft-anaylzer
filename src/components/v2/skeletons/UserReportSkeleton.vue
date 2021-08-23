<template>
  <div class="row items-start no-wrap q-mt-sm">
    <div class="col-6">
      <div class="row q-ml-md">
        <q-skeleton type="QAvatar" size="56px" animation="fade" />

        <div class="col q-pl-sm q-pb-md">
          <q-skeleton type="text" square width="30%" animation="fade" />
          <q-skeleton type="text" square width="35%" animation="fade" />
          <q-skeleton type="text" square width="35%" animation="fade" />
        </div>
      </div>
    </div>
  </div>

  <!-- formation -->
  <div class="row justify-center items-start no-wrap q-my-xl">
    <div class="col-9">
      <div class="row">
        <formation-skeleton />
      </div>
    </div>
  </div>

  <!-- line break-->
  <div class="row justify-center items-start no-wrap q-mt-sm">
    <div class="col-11">
      <div class="row">
        <div class="col q-pl-sm q-py-lg">
          <q-skeleton type="text" square height="12px" animation="fade" />
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-center items-start no-wrap q-my-xl">
    <div class="col-9">
      <div class="row">
        <player-list-skeleton :numberOfPlayers="5" />
      </div>
    </div>
  </div>

  <!-- line break-->
  <div class="row justify-center items-start no-wrap q-mt-sm">
    <div class="col-11">
      <div class="row">
        <div class="col q-pl-sm q-py-lg">
          <q-skeleton type="text" square height="12px" animation="fade" />
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-center items-start no-wrap q-my-xl">
    <div class="col-9">
      <div class="row">
        <player-list-skeleton :numberOfPlayers="5" />
      </div>
    </div>
  </div>

  <!-- line break-->
  <div class="row justify-center items-start no-wrap q-mt-sm">
    <div class="col-11">
      <div class="row">
        <div class="col q-pl-sm q-py-lg">
          <q-skeleton type="text" square height="12px" animation="fade" />
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-center items-start no-wrap q-my-xl">
    <div class="col-9">
      <div class="row">
        <player-list-skeleton :numberOfPlayers="3" />
      </div>
    </div>
  </div>

  <!-- line break-->
  <div class="row justify-center items-start no-wrap q-mt-sm">
    <div class="col-11">
      <div class="row">
        <div class="col q-pl-sm q-py-lg">
          <q-skeleton type="text" square height="12px" animation="fade" />
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-center items-start no-wrap q-my-xl">
    <div class="col-9">
      <div class="row">
        <q-scroll-area style="height: 200px; width: 100%"
          ><player-list-skeleton :numberOfPlayers="15"
        /></q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormationSkeleton from 'src/components/v2/skeletons/FormationSkeleton.vue';
import PlayerListSkeleton from 'src/components/v2/skeletons/PlayerListSkeleton.vue';

export default defineComponent({
  // name: 'ComponentName'
  components: { FormationSkeleton, PlayerListSkeleton },
});
</script>
