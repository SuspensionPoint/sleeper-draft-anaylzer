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
          <div class="fit row justify-center wrap">
            <div class="text-center col-grow q-md-lg">
              <h5 class="text-overline category-header">Most Drafted Player</h5>

              <q-img
                class="img-transparent"
                :src="getPlayerImageUrl(mostDraftedPlayer?.player?.player_id)"
                loading="lazy"
              ></q-img>
              <h4 class="text-overline">
                {{
                  `${mostDraftedPlayer?.player?.full_name} - Drafted ${mostDraftedPlayer?.draftedCount} times`
                }}
              </h4>
              <!-- <h5>
                {{
                  mostDraftedPlayer.first_name +
                  ' ' +
                  mostDraftedPlayer.last_name
                }}
              </h5> -->
            </div>

            <div class="text-center col-grow q-md-lg">
              <h5 class="text-overline category-header">Biggest Reach</h5>
              <h4 class="text-overline">
                {{ biggestReach?.player?.full_name }}
              </h4>
            </div>

            <div class="text-center col-grow q-md-lg">
              <h5 class="text-overline category-header">Average Pick Value</h5>
            </div>

            <!-- <player-analysis-card
              v-for="playerToPicksMapping in playerToPickHistory"
              :key="playerToPicksMapping[0].player_id"
              :playerToPickHistory="playerToPicksMapping"
            /> -->
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';
import {
  DisplayedUserInfo,
  DisplayedPick,
  DisplayedPlayer,
  MostDraftedPlayer,
  BiggestReach,
} from 'src/components/models';
import { Player } from 'src/api';
import { getPlayerImageUrl } from './utils';
import _ from 'lodash';
// import PlayerAnalysisCard from './PlayerAnalysisCard.vue';

export default defineComponent({
  // components: { PlayerAnalysisCard },
  // name: 'ComponentName'
  props: {
    userInfo: Object as PropType<DisplayedUserInfo>,
  },
  setup(props) {
    const mostDraftedPlayer = computed(() => {
      let mostDraftedPlayer: Player = {} as Player;
      let draftedCount = 0;

      for (let [player, pickArray] of playerToPickHistory.value) {
        if (pickArray.length > draftedCount) {
          draftedCount = pickArray.length;
          mostDraftedPlayer = player;
        }
      }

      return {
        player: mostDraftedPlayer,
        draftedCount,
      } as MostDraftedPlayer;
    });

    const biggestReach = computed(() => {
      let biggestReach: BiggestReach = {} as BiggestReach;

      for (let [player, pickArray] of playerToPickHistory.value) {
        const playerAdp = player.adp;
        if (playerAdp) {
          const hightesPositionDrafted = pickArray.reduce((p1, p2) =>
            p1.pick_no > p2.pick_no ? p1 : p2
          );
        }
      }

      return biggestReach;
    });

    const playerToPickHistory = computed(() => {
      const playerToPick = new Map<DisplayedPlayer, DisplayedPick[]>();

      if (props.userInfo?.picks) {
        props.userInfo?.picks.forEach((pick) => {
          if (playerToPick.has(pick.player)) {
            playerToPick.get(pick.player)?.push(pick);
          } else {
            playerToPick.set(pick.player, [pick]);
          }
        });
      }

      console.log('player to pick', playerToPick);
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
      playerToPickHistory,
      mostDraftedPlayer,
      getPlayerImageUrl,
      biggestReach,
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

  .category-header {
    font-size: 1.2rem;
  }
}

.img-transparent {
  background: center center / cover transparent;
}
</style>
