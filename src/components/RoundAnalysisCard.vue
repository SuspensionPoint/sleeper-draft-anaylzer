<template>
  <div
    class="flip-container"
    v-bind:class="{ flipOver: flipOver }"
    @click="flipOver = !flipOver"
  >
    <div class="flipper">
      <div class="front">
        <div class="row player-card">
          <div class="col">
            <h5 class="text-overline category">
              Round {{ $props.roundAnalysis.round }}
            </h5>

            <h4 class="text-overline positions">
              {{ positionsToString($props.roundAnalysis.mostDraftedPosition) }}
            </h4>

            <div class="row no-wrap justify-around items-start content-start">
              <div
                v-for="mostCommon in $props.roundAnalysis
                  .mostDraftedPlayersOfPositions"
                :key="mostCommon.player.player_id"
                class="col-shrink player-img-col"
                style="overflow: auto"
              >
                <p class="player-name">
                  {{ mostCommon.player.full_name }}
                </p>

                <q-img
                  v-if="imageUrl && !imageLoadError"
                  class="player-img"
                  :src="getPlayerImageUrl(mostCommon.player.player_id)"
                  @error="imageLoadFailed()"
                  loading="lazy"
                ></q-img>

                <q-img
                  v-if="imageLoadError"
                  class="player-img"
                  src="~assets/player-placeholder.png"
                  @error="imageLoadError = true"
                  loading="lazy"
                ></q-img>

                <div
                  v-if="mostCommon.player.position"
                  class="row justify-around player-info"
                >
                  <q-img
                    class="logo-icon"
                    :src="`logos/${mostCommon.player.team}.png`"
                    loading="lazy"
                  >
                  </q-img>
                  <p>•</p>
                  <p>#{{ mostCommon.player.number }}</p>
                  <p>•</p>
                  <p>
                    {{ mostCommon.player.position }}
                  </p>
                </div>
              </div>
              <!-- <div class="col-grow">
              <q-img
                v-if="imageUrl && !imageLoadError"
                class="player-img"
                :src="imageUrl"
                @error="imageLoadFailed()"
                loading="lazy"
              ></q-img>

              <q-img
                v-if="imageLoadError"
                class="player-img"
                src="~assets/player-placeholder.png"
                @error="imageLoadError = true"
                loading="lazy"
              ></q-img>

              <div
                v-if="
                  $props.roundAnalysis.mostDraftedPlayersOfPositions[0]?.player
                    .position
                "
                class="row justify-around img-margin-bottom"
              >
                <q-img
                  class="logo-icon"
                  :src="`logos/${$props.roundAnalysis.mostDraftedPlayersOfPositions[0]?.player.team}.png`"
                  loading="lazy"
                >
                </q-img>
                <p>•</p>
                <p>
                  #{{
                    $props.roundAnalysis.mostDraftedPlayersOfPositions[0]
                      ?.player.number
                  }}
                </p>
                <p>•</p>
                <p>
                  {{
                    $props.roundAnalysis.mostDraftedPlayersOfPositions[0]
                      ?.player.position
                  }}
                </p>
              </div>
            </div> -->
            </div>

            <div class="row no-wrap justify-center items-start content-start">
              <q-markup-table dense flat>
                <thead>
                  <tr>
                    <th class="text-left"><b>Position</b></th>
                    <th class="text-right"><b>Percentage Drafted</b></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-left">QB</td>
                    <td class="text-right">
                      <span
                        v-bind:class="{
                          'text-green':
                            $props.roundAnalysis.distribution.quarterback > 50,
                          'text-red':
                            $props.roundAnalysis.distribution.quarterback < 25,
                        }"
                        >{{
                          $props.roundAnalysis.distribution.quarterback
                        }}%</span
                      >
                    </td>
                  </tr>

                  <tr>
                    <td class="text-left">RB</td>
                    <td class="text-right">
                      <span
                        v-bind:class="{
                          'text-green':
                            $props.roundAnalysis.distribution.runningback > 50,
                          'text-red':
                            $props.roundAnalysis.distribution.runningback < 25,
                        }"
                        >{{
                          $props.roundAnalysis.distribution.runningback
                        }}%</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">WR</td>
                    <td class="text-right">
                      <span
                        v-bind:class="{
                          'text-green':
                            $props.roundAnalysis.distribution.wide_receiver >
                            50,
                          'text-red':
                            $props.roundAnalysis.distribution.wide_receiver <
                            25,
                        }"
                      >
                        {{ $props.roundAnalysis.distribution.wide_receiver }}%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">TE</td>
                    <td class="text-right">
                      <span
                        v-bind:class="{
                          'text-green':
                            $props.roundAnalysis.distribution.tight_end > 50,
                          'text-red':
                            $props.roundAnalysis.distribution.tight_end < 25,
                        }"
                        >{{
                          $props.roundAnalysis.distribution.tight_end
                        }}%</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">DEF</td>
                    <td class="text-right">
                      <span
                        v-bind:class="{
                          'text-green':
                            $props.roundAnalysis.distribution.defense > 50,
                          'text-red':
                            $props.roundAnalysis.distribution.defense < 25,
                        }"
                        >{{ $props.roundAnalysis.distribution.defense }}%</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">K</td>
                    <td class="text-right">
                      <span
                        v-bind:class="{
                          'text-green':
                            $props.roundAnalysis.distribution.kicker > 50,
                          'text-red':
                            $props.roundAnalysis.distribution.kicker < 25,
                        }"
                        >{{ $props.roundAnalysis.distribution.kicker }}%</span
                      >
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
      </div>

      <div class="back">
        <div class="player-card">
          <h1>back</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';
import { RoundAnalysis } from './models';
import { getPlayerImageUrl } from './utils';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    roundAnalysis: {
      type: Object as PropType<RoundAnalysis>,
      required: true,
    },
  },
  setup(props) {
    const flipOver = ref(false);
    const imageLoadError = ref(false);
    const imageUrl = computed(() => {
      return getPlayerImageUrl(
        props.roundAnalysis.mostDraftedPlayersOfPositions[0]?.player.player_id
      );
    });

    const imageLoadFailed = () => {
      imageLoadError.value = true;
      console.log('Image failed to load');
    };

    const positionsToString = (positions: string[]): string => {
      return positions.join(' / ');
    };

    return {
      flipOver,
      positionsToString,
      imageUrl,
      imageLoadError,
      imageLoadFailed,
      getPlayerImageUrl,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/css/app.scss';

$height: 475px;
$width: 400px;

.flip-container {
  height: $height;
  width: $width;

  perspective: 100;
}
.flip-container.flipOver .flipper {
  transform: rotateY(180deg);
}
.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}
.front,
.back {
  transform-style: preserve-3d; /* this fixed chrome issue*/
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}
.front {
  z-index: 2;
  transform: rotateY(0);
}
.back {
  transform: rotateY(180deg);
}

.player-card {
  p,
  h4,
  h5 {
    margin: 0;
  }

  // width: 100%;
  height: $height;
  min-width: $width;
  padding: 30px;
  border: 4px solid $card-toggle-background;
  border-radius: 15px;
  box-shadow: -7px 7px 14px 0px rgb(58 58 58 / 75%);
  background-color: $card-foreground;
  color: $card-text-color;

  .category {
    font-size: 1.5rem;
  }

  .positions {
    font-size: 1.2rem;
  }

  .value {
    margin: 25px 0;
    font-size: 2rem;
  }

  .player-img-col {
    min-width: 105px;
    margin: 5px 0;
    padding: 3px;

    .player-name {
      font-weight: 400;
    }

    .player-img {
      background: center center / cover $accent-color;
      margin: 5px 0 5px;
      border: 3px solid $card-toggle-background;
      box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 75%);
    }
  }

  .player-info {
    .logo-icon {
      max-width: 25px;
    }
  }
}
</style>
