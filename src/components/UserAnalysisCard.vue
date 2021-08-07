<template>
  <q-card class="my-card" flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar size="75px">
          <img :src="getAvatarUrl()" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="card-header-label text-overline text-dark">{{
          userInfo?.display_name
        }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- <q-seperator /> -->

    <q-card-actions>
      <q-item-label class="text-overline text-dark"> Draft Data </q-item-label>

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

    <q-slide-transition-group>
      <!-- <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subtitle2">
          <div class="q-pa-md row items-start q-gutter-md">
            <player-analysis-card
              v-for="pick in userInfo?.picks"
              :key="pick.player_id"
              :pick="pick"
            />
          </div>
        </q-card-section>
      </div> -->

      <div v-for="[player, pickArray] in playerPickMap" :key="player.player_id">
        {{ player.search_full_name }}
      </div>
    </q-slide-transition-group>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';
import { DisplayedUserInfo, DisplayedPick } from 'src/components/models';
import { Player } from 'src/api';
import PlayerAnalysisCard from './PlayerAnalysisCard.vue';

// import { Pick } from 'src/api';

export default defineComponent({
  components: { PlayerAnalysisCard },
  // name: 'ComponentName'
  props: {
    userInfo: Object as PropType<DisplayedUserInfo>,
  },
  setup(props) {
    const playerPickMap = computed(() => {
      const playerToPick = new Map<Player, DisplayedPick[]>();

      if (props.userInfo?.picks) {
        props.userInfo?.picks.forEach((pick) => {
          if (playerToPick.has(pick.player)) {
            playerToPick.get(pick.player)?.push(pick);
          } else {
            playerToPick.set(pick.player, [pick]);
          }
        });
      }

      return playerToPick;
    });

    const getAvatarUrl = (): string => {
      if (props.userInfo?.avatar) {
        return `https://sleepercdn.com/avatars/${props.userInfo?.avatar}`;
      } else {
        return '';
      }
    };

    return {
      expanded: ref(false),
      getAvatarUrl,
      playerPickMap,
    };
  },
});
</script>

<style lang="scss">
.my-card {
  width: 45%;
}

.card-header-label {
  font-size: 15px;
}
</style>
