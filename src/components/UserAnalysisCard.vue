<template>
  <div ref="reportElement">
    <q-card class="my-card" flat>
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

        <q-item-section side>
          <q-item-label
            class="card-header-label text-overline"
            v-bind:class="{
              'text-green': $props.userInfo.analysis.averagePickValue > 0,
              'text-red': $props.userInfo.analysis.averagePickValue < 0,
            }"
          >
            {{
              getSignedValueString($props.userInfo.analysis.averagePickValue)
            }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn @click="exportToPng()">PNG</q-btn>
        </q-item-section>
      </q-item>

      <q-card-actions
        class="card-dropdown-button"
        @click="expanded = !expanded"
      >
        <q-item-label class="text-overline text-bold">
          Draft Data
        </q-item-label>

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
                  <most-drafted-analysis-card
                    class="player-analysis-card"
                    title="Most Drafted Player"
                    :player="$props.userInfo.analysis.mostDraftedPlayer"
                  />
                </div>

                <div class="text-center row justify-center">
                  <reach-analysis-card
                    class="player-analysis-card"
                    title="Biggest Reach"
                    :reach="$props.userInfo.analysis.biggestReach"
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
                    <positional-analysis-card
                      class="player-analysis-card-horizontal"
                      :positionalPlayer="$props.userInfo.analysis.favoriteQB"
                    />

                    <positional-analysis-card
                      class="player-analysis-card-horizontal"
                      :positionalPlayer="$props.userInfo.analysis.favoriteRB"
                    />

                    <positional-analysis-card
                      class="player-analysis-card-horizontal"
                      :positionalPlayer="$props.userInfo.analysis.favoriteWR"
                    />

                    <positional-analysis-card
                      class="player-analysis-card-horizontal"
                      :positionalPlayer="$props.userInfo.analysis.favoriteTE"
                    />
                  </div>
                </q-scroll-area>

                <h5 class="text-center">Round Tendencies</h5>
                <q-scroll-area class="reach-scroll-area">
                  <div class="text-center row no-wrap justify-center">
                    <round-analysis-card
                      v-for="roundAnalysis in $props.userInfo.analysis
                        .roundAnalysis"
                      :key="
                        'round-' +
                        roundAnalysis.round +
                        '-' +
                        roundAnalysis.probabilityToDraftedPosition
                      "
                      class="player-analysis-card-horizontal"
                      :roundAnalysis="roundAnalysis"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { DisplayedUserInfo } from 'src/components/models';
import { getAvatarUrl, getSignedValueString } from './utils';
import * as htmlToImage from 'html-to-image';

// import downloadjs from 'downloadjs';

import AnalysisCard from './AnalysisCard.vue';
import ReachAnalysisCard from './ReachAnalysisCard.vue';
import MostDraftedAnalysisCard from './MostDraftedAnalysisCard.vue';
import PositionalAnalysisCard from './PositionalAnalysisCard.vue';
import RoundAnalysisCard from './RoundAnalysisCard.vue';

export default defineComponent({
  components: {
    AnalysisCard,
    ReachAnalysisCard,
    MostDraftedAnalysisCard,
    PositionalAnalysisCard,
    RoundAnalysisCard,
  },
  // name: 'ComponentName'
  props: {
    userInfo: {
      type: Object as PropType<DisplayedUserInfo>,
      required: true,
    },
  },
  setup() {
    const reportElement = ref();
    const expanded = ref(false);

    const exportToPng = async () => {
      if (reportElement.value) {
        expanded.value = true;
        await htmlToImage.toPng(reportElement.value, { cacheBust: true });

        const originalWidth = window.outerWidth;
        const originalHeight = window.outerHeight;

        window.resizeTo(5000, originalHeight);

        htmlToImage
          .toPng(reportElement.value, {
            cacheBust: true,
            width: 4000,
            canvasWidth: 4000,
          })
          .then(function (dataUrl) {
            expanded.value = false;
            const link = document.createElement('a');
            link.download = 'my-image-name.jpeg';
            link.href = dataUrl;
            link.click();
            window.resizeTo(originalWidth, originalHeight);
          })
          .catch(function (error) {
            console.error('Failed to export report image', error);
            window.resizeTo(originalWidth, originalHeight);
          });
      }
    };

    return {
      expanded,
      getAvatarUrl,
      getSignedValueString,
      exportToPng,
      reportElement,
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
    font-size: 17.5px;
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
