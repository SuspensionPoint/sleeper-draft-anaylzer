<template>
  <div class="player-card">
    <h5 class="text-overline category">{{ $props.title }}</h5>
    <h5 class="name">
      {{ $props.subTitle1 }}
    </h5>
    <h5 class="name">
      {{ $props.subTitle2 }}
    </h5>

    <q-img
      v-if="$props.image && !imageLoadError"
      class="player-img"
      :src="$props.image"
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
    subTitle1: {
      type: String,
    },
    subTitle2: {
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
    margin: 25px 0;
    border: 3px solid $card-toggle-background;
    box-shadow: 0px 0px 9px 0px rgb(0 0 0 / 75%);
  }

  .value {
    margin: 25px 0;
    font-size: 2rem;
  }
}
</style>
