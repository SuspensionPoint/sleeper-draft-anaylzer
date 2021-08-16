<template>
  <div
    class="flip-container"
    v-bind:class="{ flipOver: flipOver }"
    @click="flipOver = !flipOver"
  >
    <div class="flipper">
      <div class="front">
        <div class="player-card">
          <h5 class="text-overline category">
            Round {{ $props.roundAnalysis.round }}
          </h5>

          <h4 class="text-overline positions">
            {{ positionsToString($props.roundAnalysis.mostDraftedPosition) }}
          </h4>

          <div>
            <q-markup-table dense>
              <thead>
                <tr>
                  <th class="text-left">Position</th>
                  <th class="text-right">Percentage Drafted</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left">QB</td>
                  <td class="text-right">
                    {{ $props.roundAnalysis.distribution.quarterback }}%
                  </td>
                </tr>

                <tr>
                  <td class="text-left">RB</td>
                  <td class="text-right">
                    {{ $props.roundAnalysis.distribution.runningback }}%
                  </td>
                </tr>
                <tr>
                  <td class="text-left">WR</td>
                  <td class="text-right">
                    {{ $props.roundAnalysis.distribution.wide_receiver }}%
                  </td>
                </tr>
                <tr>
                  <td class="text-left">TE</td>
                  <td class="text-right">
                    {{ $props.roundAnalysis.distribution.tight_end }}%
                  </td>
                </tr>
                <tr>
                  <td class="text-left">DEF</td>
                  <td class="text-right">
                    {{ $props.roundAnalysis.distribution.defense }}%
                  </td>
                </tr>
                <tr>
                  <td class="text-left">K</td>
                  <td class="text-right">
                    {{ $props.roundAnalysis.distribution.kicker }}%
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <!-- <p>
            Drafted {{ $props.positionalPlayer.picks.length }} time(s). <br />
            On average at the
            {{
              favoriteFormattedPickSpot(
                $props.positionalPlayer.avgRoundNumber,
                $props.positionalPlayer.avgPickNumber,
                $props.positionalPlayer.picks[0].draftTeamCount
              )
            }}
            spot.
          </p> -->
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
import { defineComponent, ref, PropType } from 'vue';
import { RoundAnalysis } from './models';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    roundAnalysis: {
      type: Object as PropType<RoundAnalysis>,
      required: true,
    },
  },
  setup() {
    const flipOver = ref(false);

    const positionsToString = (positions: string[]): string => {
      return positions.join(' / ');
    };

    return {
      flipOver,
      positionsToString,
    };
  },
});
</script>

<style lang="scss">
@import 'src/css/app.scss';

$height: 475px;
$width: 295px;

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
    font-size: 1.2rem;
  }

  .positions {
    font-size: 1.5rem;
    margin: 5vh 0 5vh;
  }

  .value {
    margin: 25px 0;
    font-size: 2rem;
  }
}
</style>
