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
            <div class="col justify-center wrap">
              <div class="text-center row justify-center">
                <div class="player-card">
                  <h5 class="text-overline category">Most Drafted Player</h5>
                  <h5 class="name">
                    {{ report.mostDraftedPlayer?.player?.full_name }}
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
                  <p>
                    Drafted {{ report.mostDraftedPlayer?.draftedCount }}
                    {{
                      report.mostDraftedPlayer?.draftedCount > 1
                        ? 'times'
                        : 'time'
                    }}.
                  </p>
                </div>
              </div>

              <div class="text-center row justify-center">
                <div class="player-card">
                  <h5 class="text-overline category">Biggest Reach</h5>
                  <h5 class="name">
                    {{ report.biggestReach?.pick.player?.full_name }}
                  </h5>

                  <q-img
                    class="player-img"
                    :src="
                      getPlayerImageUrl(report.biggestReach?.pick.player_id)
                    "
                    loading="lazy"
                  ></q-img>
                  <p>
                    {{ getReachText(report.biggestReach) }} <br />
                    They've drafted this player
                    {{ report.biggestReach?.draftedCount }}
                    {{
                      report.biggestReach?.draftedCount &&
                      report.biggestReach?.draftedCount > 1
                        ? 'times'
                        : 'time'
                    }}.
                  </p>
                </div>
              </div>

              <div class="text-center row justify-center">
                <div class="player-card">
                  <h5 class="text-overline category">Most Common Reach</h5>
                  <h4 class="name">
                    {{ report.mostCommonReach?.pick.player?.full_name }}
                  </h4>

                  <q-img
                    class="player-img"
                    :src="
                      getPlayerImageUrl(report.mostCommonReach?.pick.player_id)
                    "
                    loading="lazy"
                  ></q-img>
                  <p>
                    {{ report.userInfo.display_name }} has drafted
                    {{ report.mostCommonReach?.pick.player.last_name }}
                    {{ report.mostCommonReach?.draftedCount }} times. <br />
                    Drafted on average
                    {{
                      report.mostCommonReach?.picksAboveAdp
                        ? Math.round(
                            Math.abs(report.mostCommonReach?.picksAboveAdp)
                          )
                        : 0
                    }}
                    picks above ADP.
                  </p>
                </div>
              </div>

              <div class="text-center row justify-center">
                <div class="player-card">
                  <h5 class="text-overline category">Average Pick Value</h5>
                  <h5
                    class="text-overline value"
                    v-bind:class="{
                      'text-green': report.averagePickValue > 0,
                      'text-red': report.averagePickValue < 0,
                    }"
                  >
                    {{ report.averagePickValue.toFixed(2) }}
                  </h5>
                  <p>
                    This value represents the average value of a draft pick from
                    {{ report.userInfo.display_name }}. <br />
                    A > 0 value represents that they typically draft a user
                    lower than their ADP and on average how many picks past ADP
                    they make that selection. <br />
                    A '&lt;' 0 value suggest the opposite, that they tend to
                    reach for players and how many picks ahead they typically do
                    so. <br />
                    A 0 value would suggest that they're entirely chalk and
                    typically draft exactly at ADP.
                  </p>
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
  Reach,
  UserAnalysisReport,
  DisplayedPlayer,
} from 'src/components/models';
import { getPlayerImageUrl } from './utils';
import _, { Dictionary } from 'lodash';
// import PlayerAnalysisCard from './PlayerAnalysisCard.vue';

const DEFAULT_HIGH_ADP = 9999;
const REACH_THRESHOLD = -0.5;

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
    };
  },
});
</script>

<style lang="scss">
$card-foreground: #00bfb3;
$card-toggle-background: #037971;
$card-toggle-border: #036b64;
$card-background: #03b5aa;
$card-text-color: #eef1f7;
$accent-color: #fead58;

.player-card {
  p,
  h4,
  h5 {
    margin: 0;
  }

  border: 4px solid $card-toggle-background;
  margin: 50px;
  padding: 30px;
  background-color: $card-text-color;
  box-shadow: -7px 7px 14px 0px rgb(58 58 58 / 75%);
  border-radius: 15px;
  max-width: 325px;

  .category {
    font-size: 1.2rem;
  }

  .name {
    font-size: 1.1rem;
  }

  .player-img {
    background: center center / cover $accent-color;
    margin: 25px 0;
    border: 3px solid $card-toggle-background;
    box-shadow: 0px 0px 9px 0px rgb(0 0 0 / 75%);
  }

  .value {
    margin: 25px 0;
    font-size: 2rem;
  }
}

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
