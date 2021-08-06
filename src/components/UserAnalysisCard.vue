<template>
  <q-card class="my-card" flat bordered>
    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

    <q-card-section>
      <div class="text-overline text-orange-9">
        {{ userInfo?.display_name }}
      </div>
      <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
      <!-- <div class="text-caption text-grey">
        <div
          v-for="[playerId, picks] in Object.entries(draftedPlayers)"
          :key="playerId"
        >
          <h4>Player ID: {{ playerId }}</h4>
          <h5>Times Picked:</h5>
          <p>{{ picks }}</p>
        </div>
      </div> -->
    </q-card-section>

    <q-card-actions>
      <q-btn flat color="dark" label="Share" />
      <q-btn flat color="primary" label="Book" />

      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subitle2">
          <h5
            v-for="draftPick in userInfo?.picks"
            :key="draftPick.player_id + draftPick.draft_id"
          >
            {{
              draftPick.metadata.first_name + ' ' + draftPick.metadata.last_name
            }}
          </h5>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { DisplayedUserInfo } from 'src/components/models';
// import { Pick } from 'src/api';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    userInfo: Object as PropType<DisplayedUserInfo>,
  },
  setup() {
    return {
      expanded: ref(false),
    };
  },
});
</script>

<style lang="scss">
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>
