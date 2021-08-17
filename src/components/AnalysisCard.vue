<template>
  <div class="flip-container" v-bind:class="{ flipOver: flipOver }">
    <div class="flipper">
      <div class="front">
        <div class="card">
          <h5 class="text-overline category">{{ $props.title }}</h5>
          <h5 class="name">
            {{ $props.subTitle }}
          </h5>

          <q-img
            v-if="$props.image && !imageLoadError"
            class="card-img"
            :src="$props.image"
            @error="imageLoadFailed()"
            loading="lazy"
          ></q-img>

          <h5
            v-if="$props.value"
            class="text-overline value"
            v-bind:class="{
              'text-green': $props.value > 0,
              'text-red': $props.value < 0,
            }"
          >
            {{ getSignedValueString($props.value) }}
          </h5>

          <p>
            {{ $props.description }}
          </p>
        </div>
      </div>

      <div class="back">
        <div class="player-card">
          <h2>back of card</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getSignedValueString } from './utils';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
    image: {
      type: String,
    },
    value: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  setup() {
    const flipOver = ref(false);
    const imageLoadError = ref(false);
    const imageLoadFailed = () => {
      imageLoadError.value = true;
      console.log('Image failed to load');
    };

    return {
      getSignedValueString,
      imageLoadError,
      imageLoadFailed,
      flipOver,
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

.card {
  p,
  h4,
  h5 {
    margin: 0;
  }

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

  .card-img {
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
}
</style>
