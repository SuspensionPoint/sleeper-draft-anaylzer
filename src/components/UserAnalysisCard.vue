<template>
  <q-card class="my-card" flat bordered>
    <q-item class="card-header">
      <q-item-section avatar>
        <q-avatar size="75px">
          <img :src="getAvatarUrl()" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="card-header-label text-overline card-text-color">{{
          userInfo?.display_name
        }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- <q-seperator /> -->

    <q-card-actions class="card-dropdown-button" @click="expanded = !expanded">
      <q-item-label class="text-overline text-bold card-text-color">
        Draft Data
      </q-item-label>

      <q-space />

      <q-btn
        class="card-text-color"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
      />
    </q-card-actions>

    <div>
      <div class="card-back-drop" v-show="expanded">
        <q-separator />
        <q-card-section class="text-subtitle2">
          <div class="q-pa-md row items-start q-gutter-md">
            <player-analysis-card
              v-for="playerToPicksMapping in playerPickMap"
              :key="playerToPicksMapping[0].player_id"
              :playerToPickHistory="playerToPicksMapping"
            />

            <!-- <player-analysis-card
              v-for="pick in userInfo?.picks"
              :key="pick.player_id"
              :pick="pick"
            /> -->
          </div>
        </q-card-section>
      </div>

      <!-- <div v-for="[player, pickArray] in playerPickMap" :key="player.player_id">
        {{
          player.first_name +
          ' ' +
          player.last_name +
          ' ' +
          `Picked ${pickArray.length} times`
        }}
      </div> -->
    </div>
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
$card-foreground: #00bfb3;
$card-toggle-background: #037971;
$card-toggle-border: #036b64;
$card-background: #03b5aa;
$card-text-color: #ebfffe;

.my-card {
  width: 45%;

  .card-text-color {
    color: $card-text-color;
  }

  .card-header {
    background-color: $card-foreground;
    box-shadow: -1px -14px 59px -27px rgba(0, 0, 0, 0.75) inset;
    -webkit-box-shadow: -1px -14px 59px -27px rgba(0, 0, 0, 0.75) inset;
    -moz-box-shadow: -1px -14px 59px -27px rgba(0, 0, 0, 0.75) inset;
  }

  .card-back-drop {
    background-color: $card-background;
    box-shadow: -2px 14px 45px -1px rgba(0, 0, 0, 0.27) inset;
    -webkit-box-shadow: -2px 14px 45px -1px rgba(0, 0, 0, 0.27) inset;
    -moz-box-shadow: -2px 14px 45px -1px rgba(0, 0, 0, 0.27) inset;
  }

  .card-dropdown-button {
    background-color: $card-toggle-background;
    border: 1px solid $card-toggle-border;
    cursor: pointer;
  }

  .card-header-label {
    font-size: 15px;
  }
}
</style>
