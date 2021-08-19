<template>
  <div
    class="flip-container"
    v-bind:class="{ flipOver: flipOver }"
    @click="flipOver = !flipOver"
  >
    <div class="flipper">
      <div class="front">
        <div class="player-card">
          <h5 class="text-overline category">{{ $props.title }}</h5>

          <div v-if="!$props.reach">
            <div class="row items-center">
              <div>This user has never reached for a player... 😲</div>
            </div>
          </div>

          <div v-if="$props.reach">
            <h5 class="name">
              {{ $props.reach?.picks[0]?.player.full_name }}
            </h5>

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
              v-if="$props.reach?.picks[0]?.player.position"
              class="row justify-around img-margin-bottom"
            >
              <q-img
                class="logo-icon"
                :src="`logos/${$props.reach?.picks[0]?.player.team}.png`"
                loading="lazy"
              >
              </q-img>
              <p>•</p>
              <p>#{{ $props.reach?.picks[0]?.player.number }}</p>
              <p>•</p>
              <p>{{ $props.reach?.picks[0]?.player.position }}</p>
            </div>

            <p>
              Drafted {{ reach?.draftedCount }} time(s). <br />
              Drafted at the {{ formattedPickSpot(reach?.picks[0]) }} spot,
              {{ Math.abs(reach?.picksAboveAdp ? reach?.picksAboveAdp : 0) }}
              picks above his ADP of {{ reach?.picks[0]?.player.adp_formatted }}
            </p>
          </div>
        </div>
      </div>

      <div class="back">
        <div class="player-card-back justify-center">
          <q-btn
            stack
            rounded
            glossy
            class="open-drafts-btn"
            @click.stop="openDrafts()"
            label="Open Drafts Reached For"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';
import { getPlayerImageUrl, formattedPickSpot } from './utils';
import { openDraftUrl } from './sleeper';
import { Reach } from './models';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    title: {
      type: String,
    },
    reach: {
      type: Object as PropType<Reach>,
    },
  },
  setup(props) {
    const flipOver = ref(false);
    const imageLoadError = ref(false);
    const imageUrl = computed(() => {
      return getPlayerImageUrl(props.reach?.picks[0]?.player_id);
    });

    const openDrafts = () => {
      props.reach?.picks.forEach((p) => openDraftUrl(p));
    };

    const imageLoadFailed = () => {
      imageLoadError.value = true;
      console.log('Image failed to load');
    };

    return {
      imageLoadError,
      imageLoadFailed,
      flipOver,
      openDrafts,
      imageUrl,
      formattedPickSpot,
    };
  },
});
</script>

<style lang="scss" scoped>
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

.player-card,
.player-card-back {
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

  .name {
    font-size: 1.1rem;
  }

  .player-img {
    background: center center / cover $accent-color;
    margin: 25px 0 10px;
    border: 3px solid $card-toggle-background;
    box-shadow: 0px 0px 9px 0px rgb(0 0 0 / 75%);
  }

  .img-margin-bottom {
    margin-bottom: 25px;
  }

  .value {
    margin: 25px 0;
    font-size: 2rem;
  }

  .logo-icon {
    max-width: 25px;
  }
}

.player-card-back {
  display: flex;
  .open-drafts-btn {
    font-size: 1.2rem;
    background: black;
    color: white;
    margin: 25% 10%;
  }
}
</style>
