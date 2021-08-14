<template>
  <q-card class="my-card" flat bordered>
    <q-item class="card-header">
      <q-item-section avatar>
        <q-avatar size="75px">
          <img :src="getAvatarUrl($props.userInfo)" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="card-header-label text-overline">{{
          $props.userInfo?.display_name
        }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-card-actions class="card-dropdown-button" @click="expanded = !expanded">
      <q-item-label class="text-overline text-bold"> Draft Data </q-item-label>

      <q-space />

      <q-btn
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
            <div class="col justify-center wrap">
              <div class="text-center row justify-center">
                <player-analysis-card
                  class="player-analysis-card"
                  title="Most Drafted Player"
                  :subTitle="
                    $props.userInfo.analysis.mostDraftedPlayer?.player.full_name
                  "
                  :image="
                    getPlayerImageUrl(
                      $props.userInfo.analysis.mostDraftedPlayer?.player
                        ?.player_id
                    )
                  "
                  :description="
                    'Drafted ' +
                    $props.userInfo.analysis.mostDraftedPlayer?.draftedCount +
                    ' time(s)'
                  "
                  :team="
                    $props.userInfo.analysis.mostDraftedPlayer?.player.team
                  "
                  :playerNumber="
                    $props.userInfo.analysis.mostDraftedPlayer?.player.number
                  "
                  :playerPosition="
                    $props.userInfo.analysis.mostDraftedPlayer?.player.position
                  "
                />
              </div>

              <div class="text-center row justify-center">
                <player-analysis-card
                  class="player-analysis-card"
                  title="Biggest Reach"
                  :subTitle="
                    $props.userInfo.analysis.biggestReach?.pick?.player
                      .full_name
                  "
                  :image="
                    getPlayerImageUrl(
                      $props.userInfo.analysis.biggestReach?.pick.player_id
                    )
                  "
                  :description="
                    'They\'ve drafted ' +
                    $props.userInfo.analysis.biggestReach?.pick.player
                      .last_name +
                    ' ' +
                    $props.userInfo.analysis.biggestReach?.draftedCount +
                    ' time(s). They drafted him in round #' +
                    $props.userInfo.analysis.biggestReach?.roundNumber +
                    ' pick #' +  $props.userInfo.analysis.biggestReach?.pickNumber +
                    ', ' +  $props.userInfo.analysis.biggestReach?.picksAboveAdp + ' picks above ADP.'
                  "
                  :team="
                    $props.userInfo.analysis.biggestReach?.pick?.player.team
                  "
                  :playerNumber="
                    $props.userInfo.analysis.biggestReach?.pick?.player.number
                  "
                  :playerPosition="
                    $props.userInfo.analysis.biggestReach?.pick?.player.position
                  "
                />
              </div>

              <div class="text-center row justify-center">
                <player-analysis-card
                  class="player-analysis-card"
                  title="Most Common Reach"
                  :subTitle="
                    $props.userInfo.analysis.mostCommonReach?.pick?.player
                      .full_name
                  "
                  :image="
                    getPlayerImageUrl(
                      $props.userInfo.analysis.mostCommonReach?.pick.player_id
                    )
                  "
                  :description="
                    $props.userInfo.display_name +
                    ' has drafted ' +
                    $props.userInfo.analysis.mostCommonReach?.pick.player
                      .last_name +
                    ' ' +
                    $props.userInfo.analysis.mostCommonReach?.draftedCount +
                    ' time(s) \n' +
                    'Drafted on average ' +
                    averagePicksAboveAdp(
                      $props.userInfo.analysis.mostCommonReach
                    ) +
                    ' picks above ADP.'
                  "
                  :team="
                    $props.userInfo.analysis.mostCommonReach?.pick?.player.team
                  "
                  :playerNumber="
                    $props.userInfo.analysis.mostCommonReach?.pick?.player
                      .number
                  "
                  :playerPosition="
                    $props.userInfo.analysis.mostCommonReach?.pick?.player
                      .position
                  "
                />
              </div>


              <h5 class="text-center">Top Reaches</h5>
              <q-scroll-area class="reach-scroll-area">
                <div class="text-center row no-wrap justify-center">
                  <player-analysis-card
                    v-for="reach in $props.userInfo.analysis.topFiveReaches"
                    :key="'reach-' + reach.pick.player_id"
                    class="player-analysis-card-horizontal"
                    title="Reach"
                    :subTitle="
                    reach?.pick?.player
                        .full_name
                    "
                    :image="
                      getPlayerImageUrl(
                        reach?.pick.player_id
                      )
                    "
                    :description="
                      $props.userInfo.display_name +
                      ' has drafted ' +
                      reach?.pick.player
                        .last_name +
                      ' ' +
                      reach?.draftedCount +
                      ' time(s) \n' +
                      'Drafted on average ' +
                      averagePicksAboveAdp(
                        reach
                      ) +
                      ' picks above ADP.'
                    "
                    :team="
                    reach.pick?.player.team
                    "
                    :playerNumber="
                    reach.pick?.player
                        .number
                    "
                    :playerPosition="
                    reach?.pick?.player
                        .position
                    "
                  />
                </div>
              </q-scroll-area>

              <div class="text-center row justify-center">
                <player-analysis-card
                  class="player-analysis-card"
                  title="Average Pick Value"
                  :value="$props.userInfo.analysis.averagePickValue"
                  :description="
                    'This value represents the average value of a draft pick from ' +
                    $props.userInfo.display_name +
                    '. A > 0 value represents that they typically draft a user lower than their \
                    ADP and on average how many picks past ADP they make that selection. \n' +
                    'A < 0 value suggest the opposite, that they tend to \
                    reach for players and how many picks ahead they typically do \
                    so. \n' +
                    'A 0 value would suggest that they\'re entirely chalk and \
                    typically draft exactly at ADP.'
                  "
                />
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
import { defineComponent, ref, PropType } from 'vue';
import {
  DisplayedUserInfo,
  Reach,
  DisplayedPlayer,
} from 'src/components/models';
import { getPlayerImageUrl, getAvatarUrl } from './utils';
import PlayerAnalysisCard from './PlayerAnalysisCard.vue';

export default defineComponent({
  components: { PlayerAnalysisCard },
  // name: 'ComponentName'
  props: {
    userInfo: {
      type: Object as PropType<DisplayedUserInfo>,
      required: true,
    },
  },
  setup() {
    const playerInfoString = (player: DisplayedPlayer | undefined): string => {
      if (!player) {
        return '';
      }

      return `${player.team} ∙ #${player.number} ∙ ${player.position}`;
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

    const getReachText = (reach: Reach | undefined): string => {
      if (!reach) {
        return '';
      }

      const numTeams = reach.pick.draftTeamCount;
      const pickNumber = numToText(reach.pick.pick_no % numTeams);
      const roundSelectedString = numToText(reach.pick.round);
      const adpPickNumberString = numToText(
        Math.round((reach.pick.player.adp as number) % numTeams)
      );
      const adpPickRound = numToText(
        Math.floor((reach.pick.player.adp as number) / numTeams)
      );

      return `Drafted with the ${pickNumber} pick in the ${roundSelectedString} round while his ADP is the ${adpPickNumberString} pick of the ${adpPickRound} round.`;
    };

    const averagePicksAboveAdp = (reach: Reach | undefined): string => {
      if (reach) {
        return `${
          reach?.picksAboveAdp ? Math.round(Math.abs(reach?.picksAboveAdp)) : 0
        }`;
      }

      return '0';
    };

    return {
      expanded: ref(false),
      getAvatarUrl,
      getPlayerImageUrl,
      getReachText,
      playerInfoString,
      averagePicksAboveAdp,
    };
  },
});
</script>

<style lang="scss">
@import 'src/css/app.scss';

.my-card {
  width: 45%;

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
    color: $card-toggle-color;
    border: 1px solid $card-toggle-border;
    cursor: pointer;
  }

  .card-header-label {
    font-size: 15px;
  }

  .player-analysis-card {
    margin: 50px;
  }

  .player-analysis-card-horizontal {
    margin: 0 25px;
    min-width: 250px;
  }

  .reach-scroll-area {
    height: 500px;
  }
}
</style>
