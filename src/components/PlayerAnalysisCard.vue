<template>
  <div class="player-card">
    <h5 class="text-overline category">{{ $props.title }}</h5>
    <h5 class="name">
      {{ $props.subTitle }}
    </h5>

    <q-img
      v-if="$props.image && !imageLoadError"
      class="player-img"
      v-bind:class="{
        'img-margin-bottom': !$props.playerPosition,
      }"
      :src="$props.image"
      @error="imageLoadFailed()"
      loading="lazy"
    ></q-img>

    <q-img
      v-if="imageLoadError"
      class="player-img"
      v-bind:class="{
        'img-margin-bottom': !$props.playerPosition,
      }"
      src="~assets/player-placeholder.png"
      @error="imageLoadError = true"
      loading="lazy"
    ></q-img>

    <div
      v-if="$props.playerPosition"
      class="row justify-around img-margin-bottom"
    >
      <q-img class="logo-icon" :src="`logos/${$props.team}.png`" loading="lazy">
      </q-img>
      <p>•</p>
      <p>#{{ $props.playerNumber }}</p>
      <p>•</p>
      <p>{{ $props.playerPosition }}</p>
    </div>

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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
    team: {
      type: String,
    },
    playerPosition: {
      type: String,
    },
    playerNumber: {
      type: Number,
    },
  },
  setup(props) {
    const imageLoadError = ref(false);

    const getSignedValueString = (value: number): string => {
      const decimalPlaces = 2;
      return `${props.value && props.value < 0 ? '' : '+'}${value.toFixed(
        decimalPlaces
      )}`;
    };

    const imageLoadFailed = () => {
      imageLoadError.value = true;
      console.log('Image failed to load');
    };

    return { getSignedValueString, imageLoadError, imageLoadFailed };
  },
});
</script>

<style lang="scss">
@import 'src/css/app.scss';

.player-card {
  p,
  h4,
  h5 {
    margin: 0;
  }

  max-width: 325px;
  margin: 50px;
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
</style>
