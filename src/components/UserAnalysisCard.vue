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
                  :picks="$props.userInfo.analysis.mostDraftedPlayer?.picks"
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
                    $props.userInfo.analysis.biggestReach?.picks[0]?.player
                      .full_name
                  "
                  :image="
                    getPlayerImageUrl(
                      $props.userInfo.analysis.biggestReach?.picks[0].player_id
                    )
                  "
                  :description="
                    'Drafted ' +
                    $props.userInfo.analysis.biggestReach?.draftedCount +
                    ' time(s). Drafted at the ' +
                    $props.userInfo.analysis.biggestReach?.roundNumber +
                    '.' +
                    $props.userInfo.analysis.biggestReach?.pickNumber +
                    ' spot. ' +
                    Math.abs(
                      $props.userInfo.analysis.biggestReach?.picksAboveAdp
                        ? $props.userInfo.analysis.biggestReach?.picksAboveAdp
                        : 0
                    ) +
                    ' picks above his ADP of ' +
                    $props.userInfo.analysis.biggestReach?.picks[0].player
                      .adp_formatted
                  "
                  :team="
                    $props.userInfo.analysis.biggestReach?.picks[0]?.player.team
                  "
                  :playerNumber="
                    $props.userInfo.analysis.biggestReach?.picks[0]?.player
                      .number
                  "
                  :playerPosition="
                    $props.userInfo.analysis.biggestReach?.picks[0]?.player
                      .position
                  "
                  :picks="$props.userInfo.analysis.biggestReach?.picks"
                />
              </div>

              <div class="text-center row justify-center">
                <reach-analysis-card
                  class="player-analysis-card"
                  title="Most Common Reach"
                  :reach="$props.userInfo.analysis.mostCommonReach"
                />
              </div>

              <h5 class="text-center">Top Reaches</h5>
              <q-scroll-area class="reach-scroll-area">
                <div class="text-center row no-wrap justify-center">
                  <reach-analysis-card
                    v-for="reach in $props.userInfo.analysis.topFiveReaches"
                    :key="'reach-' + reach.picks[0].player_id"
                    class="player-analysis-card-horizontal"
                    title="Reach"
                    :reach="reach"
                  />
                </div>
              </q-scroll-area>

              <h5 class="text-center">Favorite Players</h5>
              <q-scroll-area class="reach-scroll-area">
                <div class="text-center row no-wrap justify-center">
                  <player-analysis-card
                    class="player-analysis-card-horizontal"
                    title="Favorite QB"
                    :subTitle="
                      $props.userInfo.analysis.favoriteQB.player.full_name
                    "
                    :image="
                      getPlayerImageUrl(
                        $props.userInfo.analysis.favoriteQB.player.player_id
                      )
                    "
                    :description="
                      'Drafted ' +
                      $props.userInfo.analysis.favoriteQB.picks.length +
                      ' time(s). On average drafted at the ' +
                      favoriteFormattedPickSpot(
                        $props.userInfo.analysis.favoriteQB.avgRoundNumber,
                        $props.userInfo.analysis.favoriteQB.avgPickNumber,
                        $props.userInfo.analysis.favoriteQB.picks[0]
                          .draftTeamCount
                      ) +
                      ' spot.'
                    "
                    :team="$props.userInfo.analysis.favoriteQB.player.team"
                    :playerNumber="
                      $props.userInfo.analysis.favoriteQB.player.number
                    "
                    :playerPosition="
                      $props.userInfo.analysis.favoriteQB.player.position
                    "
                    :picks="$props.userInfo.analysis.favoriteQB.picks"
                  />

                  <player-analysis-card
                    class="player-analysis-card-horizontal"
                    title="Favorite RB"
                    :subTitle="
                      $props.userInfo.analysis.favoriteRB.player.full_name
                    "
                    :image="
                      getPlayerImageUrl(
                        $props.userInfo.analysis.favoriteRB.player.player_id
                      )
                    "
                    :description="
                      'Drafted ' +
                      $props.userInfo.analysis.favoriteRB.picks.length +
                      ' time(s). On average drafted at the ' +
                      favoriteFormattedPickSpot(
                        $props.userInfo.analysis.favoriteRB.avgRoundNumber,
                        $props.userInfo.analysis.favoriteRB.avgPickNumber,
                        $props.userInfo.analysis.favoriteRB.picks[0]
                          .draftTeamCount
                      ) +
                      ' spot.'
                    "
                    :team="$props.userInfo.analysis.favoriteRB.player.team"
                    :playerNumber="
                      $props.userInfo.analysis.favoriteRB.player.number
                    "
                    :playerPosition="
                      $props.userInfo.analysis.favoriteRB.player.position
                    "
                    :picks="$props.userInfo.analysis.favoriteRB.picks"
                  />

                  <player-analysis-card
                    class="player-analysis-card-horizontal"
                    title="Favorite WR"
                    :subTitle="
                      $props.userInfo.analysis.favoriteWR.player.full_name
                    "
                    :image="
                      getPlayerImageUrl(
                        $props.userInfo.analysis.favoriteWR.player.player_id
                      )
                    "
                    :description="
                      'Drafted ' +
                      $props.userInfo.analysis.favoriteWR.picks.length +
                      ' time(s). On average drafted at the ' +
                      favoriteFormattedPickSpot(
                        $props.userInfo.analysis.favoriteWR.avgRoundNumber,
                        $props.userInfo.analysis.favoriteWR.avgPickNumber,
                        $props.userInfo.analysis.favoriteWR.picks[0]
                          .draftTeamCount
                      ) +
                      ' spot.'
                    "
                    :team="$props.userInfo.analysis.favoriteWR.player.team"
                    :playerNumber="
                      $props.userInfo.analysis.favoriteWR.player.number
                    "
                    :playerPosition="
                      $props.userInfo.analysis.favoriteWR.player.position
                    "
                    :picks="$props.userInfo.analysis.favoriteWR.picks"
                  />

                  <player-analysis-card
                    class="player-analysis-card-horizontal"
                    title="Favorite TE"
                    :subTitle="
                      $props.userInfo.analysis.favoriteTE.player.full_name
                    "
                    :image="
                      getPlayerImageUrl(
                        $props.userInfo.analysis.favoriteTE.player.player_id
                      )
                    "
                    :description="
                      'Drafted ' +
                      $props.userInfo.analysis.favoriteTE.picks.length +
                      ' time(s). On average drafted at the ' +
                      favoriteFormattedPickSpot(
                        $props.userInfo.analysis.favoriteTE.avgRoundNumber,
                        $props.userInfo.analysis.favoriteTE.avgPickNumber,
                        $props.userInfo.analysis.favoriteTE.picks[0]
                          .draftTeamCount
                      ) +
                      ' spot.'
                    "
                    :team="$props.userInfo.analysis.favoriteTE.player.team"
                    :playerNumber="
                      $props.userInfo.analysis.favoriteTE.player.number
                    "
                    :playerPosition="
                      $props.userInfo.analysis.favoriteTE.player.position
                    "
                    :picks="$props.userInfo.analysis.favoriteTE.picks"
                  />
                </div>
              </q-scroll-area>

              <div class="text-center row justify-center">
                <analysis-card
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
import { getPlayerImageUrl, getAvatarUrl, formattedPickSpot } from './utils';
import PlayerAnalysisCard from './PlayerAnalysisCard.vue';
import AnalysisCard from './AnalysisCard.vue';
import ReachAnalysisCard from './ReachAnalysisCard.vue';

export default defineComponent({
  components: { PlayerAnalysisCard, AnalysisCard, ReachAnalysisCard },
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

      const numTeams = reach.picks[0].draftTeamCount;
      const pickNumber = numToText(reach.picks[0].pick_no % numTeams);
      const roundSelectedString = numToText(reach.picks[0].round);
      const adpPickNumberString = numToText(
        Math.round((reach.picks[0].player.adp as number) % numTeams)
      );
      const adpPickRound = numToText(
        Math.floor((reach.picks[0].player.adp as number) / numTeams)
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

    const favoriteFormattedPickSpot = (
      round: number,
      pickNo: number,
      teamCount: number
    ): string => {
      const pickNumber = pickNo % teamCount === 0 ? 1 : pickNo % teamCount;
      return `${round}.${pickNumber}`;
    };

    return {
      expanded: ref(false),
      getAvatarUrl,
      getPlayerImageUrl,
      getReachText,
      playerInfoString,
      averagePicksAboveAdp,
      formattedPickSpot,
      favoriteFormattedPickSpot,
    };
  },
});
</script>

<style lang="scss">
@import 'src/css/app.scss';

.my-card {
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
    margin: 50px 0;
  }

  .player-analysis-card-horizontal {
    margin: 0 25px;
  }

  .reach-scroll-area {
    height: 500px;
  }
}
</style>
