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
          report.userInfo?.display_name
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
                  title="Most Drafted Player"
                  :subTitle="report.mostDraftedPlayer?.player.full_name"
                  :image="
                    getPlayerImageUrl(
                      report.mostDraftedPlayer?.player?.player_id
                    )
                  "
                  :description="
                    'Drafted ' +
                    report.mostDraftedPlayer?.draftedCount +
                    ' time(s)'
                  "
                  :team="report.mostDraftedPlayer?.player.team"
                  :playerNumber="report.mostDraftedPlayer?.player.number"
                  :playerPosition="report.mostDraftedPlayer?.player.position"
                />
              </div>

              <div class="text-center row justify-center">
                <player-analysis-card
                  title="Biggest Reach"
                  :subTitle="report.biggestReach?.pick?.player.full_name"
                  :image="
                    getPlayerImageUrl(report.biggestReach?.pick.player_id)
                  "
                  :description="
                    'They\'ve drafted this player ' +
                    report.biggestReach?.draftedCount +
                    ' time(s)'
                  "
                  :team="report.biggestReach?.pick?.player.team"
                  :playerNumber="report.biggestReach?.pick?.player.number"
                  :playerPosition="report.biggestReach?.pick?.player.position"
                />
              </div>

              <div class="text-center row justify-center">
                <player-analysis-card
                  title="Most Common Reach"
                  :subTitle="report.mostCommonReach?.pick?.player.full_name"
                  :image="
                    getPlayerImageUrl(report.mostCommonReach?.pick.player_id)
                  "
                  :description="
                    report.userInfo.display_name +
                    ' has drafted ' +
                    report.mostCommonReach?.pick.player.last_name +
                    ' ' +
                    report.mostCommonReach?.draftedCount +
                    ' time(s)'
                  "
                  :team="report.mostCommonReach?.pick?.player.team"
                  :playerNumber="report.mostCommonReach?.pick?.player.number"
                  :playerPosition="
                    report.mostCommonReach?.pick?.player.position
                  "
                />
              </div>

              <div class="text-center row justify-center">
                <player-analysis-card
                  title="Average Pick Value"
                  :value="report.averagePickValue"
                  :description="
                    'This value represents the average value of a draft pick from ' +
                    report.userInfo.display_name +
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
import { defineComponent, ref, PropType, computed } from 'vue';
import {
  DisplayedUserInfo,
  MostDraftedPlayer,
  Reach,
  UserAnalysisReport,
  DisplayedPlayer,
} from 'src/components/models';
import { getPlayerImageUrl, getAvatarUrl } from './utils';
import _, { Dictionary } from 'lodash';
import PlayerAnalysisCard from './PlayerAnalysisCard.vue';

const DEFAULT_HIGH_ADP = 9999;
const REACH_THRESHOLD = -6;

export default defineComponent({
  components: { PlayerAnalysisCard },
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

      let biggestReach: Reach = {
        pick: {},
        picksAboveAdp: DEFAULT_HIGH_ADP, // really big #
        draftedCount: 0,
      } as Reach;

      let mostCommonReach: Reach = {
        pick: {},
        picksAboveAdp: DEFAULT_HIGH_ADP, // really big #
        draftedCount: 0,
      } as Reach;

      let totalPickValue = 0;
      let totalNumPicks = 0;

      const reachMap = {} as Dictionary<Reach[]>;

      for (const key in playerToPickHistory.value) {
        const pickArray = playerToPickHistory.value[key];
        const player = pickArray[0].player;
        const playerAdp = player.adp;

        if (pickArray.length > mostDraftedPlayer.draftedCount) {
          mostDraftedPlayer.draftedCount = pickArray.length;
          mostDraftedPlayer.player = player;
        }

        if (playerAdp) {
          let highestDraftPick = pickArray[0];
          for (const pick of pickArray) {
            if (pick.pick_no < highestDraftPick.pick_no) {
              highestDraftPick = pick;
            }

            totalPickValue += pick.pick_no - playerAdp;
            totalNumPicks++;

            const diffFromAdp = pick.pick_no - playerAdp;
            // A reach must have a negative difference
            if (diffFromAdp < REACH_THRESHOLD) {
              if (reachMap[player.player_id]) {
                reachMap[player.player_id].push({
                  pick,
                  picksAboveAdp: Math.round(diffFromAdp),
                  draftedCount: pickArray.length,
                });
              } else {
                reachMap[player.player_id] = [
                  {
                    pick,
                    picksAboveAdp: Math.round(diffFromAdp),
                    draftedCount: pickArray.length,
                  } as Reach,
                ];
              }
            }
          }

          const diffFromAdpHighest = highestDraftPick.pick_no - playerAdp;
          // A reach must have a negative difference
          if (diffFromAdpHighest < REACH_THRESHOLD) {
            if (diffFromAdpHighest < biggestReach.picksAboveAdp) {
              biggestReach = {
                pick: highestDraftPick,
                picksAboveAdp: Math.round(diffFromAdpHighest),
                draftedCount: pickArray.length,
              };
            }
          }
        }
      }

      let reachCounter = 0;
      // debugger;
      for (const player_id in reachMap) {
        const reachList = reachMap[player_id];
        const reach = reachMap[player_id][0];
        const avgPicksAboveAdp = _.mean(reachList.map((r) => r.picksAboveAdp));

        if (reachList.length > reachCounter) {
          reachCounter = reachList.length;
          mostCommonReach = {
            pick: reach.pick,
            picksAboveAdp: avgPicksAboveAdp,
            draftedCount: reach.draftedCount,
          };
        }
      }

      return {
        userInfo: props.userInfo as DisplayedUserInfo,
        biggestReach:
          biggestReach.picksAboveAdp != DEFAULT_HIGH_ADP
            ? biggestReach
            : undefined,
        mostCommonReach:
          mostCommonReach.picksAboveAdp != DEFAULT_HIGH_ADP
            ? mostCommonReach
            : undefined,
        mostDraftedPlayer,
        averagePickValue: totalPickValue / totalNumPicks,
      };
    });

    const playerToPickHistory = computed(() => {
      return _.groupBy(props.userInfo?.picks, 'player_id');
    });

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

    return {
      expanded: ref(false),
      getAvatarUrl,
      playerToPickHistory,
      getPlayerImageUrl,
      getReachText,
      report,
      playerInfoString,
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
}
</style>
