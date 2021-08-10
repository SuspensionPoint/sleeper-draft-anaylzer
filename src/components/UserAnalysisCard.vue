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
          report.userInfo?.display_name
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
          <div class="row">
            <div class="fit col justify-center wrap">
              <div class="text-center row">
                <div class="col">
                  <h5 class="text-overline category-header">
                    Most Drafted Player
                  </h5>

                  <q-img
                    class="player-img"
                    :src="
                      getPlayerImageUrl(
                        report.mostDraftedPlayer?.player?.player_id
                      )
                    "
                    loading="lazy"
                  ></q-img>
                  <h4 class="text-overline">
                    {{
                      `${report.mostDraftedPlayer?.player?.full_name} - Drafted ${report.mostDraftedPlayer?.draftedCount} times`
                    }}
                  </h4>
                </div>
              </div>

              <div class="text-center row">
                <div class="col">
                  <h5 class="text-overline category-header">Biggest Reach</h5>

                  <q-img
                    class="player-img"
                    :src="
                      getPlayerImageUrl(report.biggestReach?.pick.player_id)
                    "
                    loading="lazy"
                  ></q-img>
                  <h4 class="text-overline">
                    {{ report.biggestReach?.pick.player?.full_name }}
                  </h4>
                  <p>
                    {{ getReachText(report.biggestReach) }}
                  </p>
                </div>
              </div>

              <div class="text-center row">
                <div class="col">
                  <h5 class="text-overline category-header">
                    Average Pick Value
                  </h5>
                </div>
              </div>

              <!-- <player-analysis-card
              v-for="playerToPicksMapping in playerToPickHistory"
              :key="playerToPicksMapping[0].player_id"
              :playerToPickHistory="playerToPicksMapping"
            /> -->
            </div>
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
  MostDraftedPlayer,
  BiggestReach,
  UserAnalysisReport,
  DisplayedPlayer,
} from 'src/components/models';
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
    const report = computed((): UserAnalysisReport => {
      let mostDraftedPlayer: MostDraftedPlayer = {
        player: {} as DisplayedPlayer,
        draftedCount: 0,
      };

      let biggestReach: BiggestReach = {
        pick: {},
        picksAboveAdp: 9999, // really big #
      } as BiggestReach;

      let averagePickValue = 0;

      for (const key in playerToPickHistory.value) {
        const pickArray = playerToPickHistory.value[key];
        const player = pickArray[0].player;
        const playerAdp = player.adp;

        if (pickArray.length > mostDraftedPlayer.draftedCount) {
          mostDraftedPlayer.draftedCount = pickArray.length;
          mostDraftedPlayer.player = player;
        }

        if (playerAdp) {
          const highestDraftPick = pickArray.reduce((p1, p2) =>
            p1.pick_no < p2.pick_no ? p1 : p2
          );
          const diffFromAdp = highestDraftPick.pick_no - playerAdp;

          if (diffFromAdp < biggestReach.picksAboveAdp) {
            biggestReach = {
              pick: highestDraftPick,
              picksAboveAdp: Math.round(diffFromAdp),
            };
          }
        }
      }

      return {
        userInfo: props.userInfo as DisplayedUserInfo,
        biggestReach,
        mostDraftedPlayer,
        averagePickValue,
      };
    });

    const playerToPickHistory = computed(() => {
      return _.groupBy(props.userInfo?.picks, 'player_id');
    });

    const getAvatarUrl = (): string => {
      if (props.userInfo?.avatar) {
        return `https://sleepercdn.com/avatars/${props.userInfo?.avatar}`;
      } else {
        return '';
      }
    };

    const numToText = (d: number): string => {
      if (d > 3 && d < 21) return `${d}th`;
      switch (d % 10) {
        case 1:
          return `${d}st`;
        case 2:
          return `${d}nd`;
        case 3:
          return `${d}rd`;
        default:
          return `${d}th`;
      }
    };

    const getReachText = (reach: BiggestReach): string => {
      const numTeams = reach.pick.draftTeamCount;
      const pickNumber = numToText(reach.pick.pick_no % numTeams);
      const roundSelectedString = numToText(reach.pick.round);
      const adpPickNumberString = numToText(
        Math.round((reach.pick.player.adp as number) % numTeams)
      );
      const adpPickRound = Math.floor(
        (reach.pick.player.adp as number) / numTeams
      );
      const numTimesDrafted =
        playerToPickHistory.value[reach.pick.player_id].length;

      return `Drafted with the ${pickNumber} pick in the ${roundSelectedString} round while his ADP is the ${adpPickNumberString} pick of the ${adpPickRound} round. \n They've drafted this player ${numTimesDrafted} times.`;
    };

    return {
      expanded: ref(false),
      getAvatarUrl,
      playerToPickHistory,
      getPlayerImageUrl,
      getReachText,
      report,
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

.player-img {
  background: center center / cover transparent;
  width: 150px;
}
</style>
