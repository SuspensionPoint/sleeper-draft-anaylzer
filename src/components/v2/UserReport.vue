<template>
  <div>
    <q-card class="my-card" flat dark>
      <q-item class="card-header">
        <q-item-section avatar>
          <q-avatar size="75px">
            <img :src="getAvatarUrl($props.userInfo)" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <div class="row">
            <div class="col">
              <q-item-label
                class="card-header-label text-overline items-center"
                >{{ $props.userInfo?.display_name }}</q-item-label
              >

              <q-item-label class="text-overline items-center"
                ><b>Draft Slot:</b>
                {{
                  $props.userInfo?.draftSlot
                    ? $props.userInfo?.draftSlot
                    : 'All'
                }}</q-item-label
              >
            </div>
          </div>
        </q-item-section>

        <q-item-section v-if="$props.userInfo.picks.length > 0" side>
          <q-item-label
            class="
              row
              justify-center
              items-center
              card-header-label
              text-overline
            "
            v-bind:class="{
              'text-green': $props.userInfo.analysis.averagePickValue > 0,
              'text-red': $props.userInfo.analysis.averagePickValue < 0,
            }"
          >
            Grade:
            {{
              getSignedValueString($props.userInfo.analysis.averagePickValue)
            }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>

  <div class="col-12">
    <div class="row items-start">
      <div class="col-12">
        <div class="row justify-center q-my-xl">
          <dream-lineup :userInfo="$props.userInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DisplayedUserInfo } from '../models';
import { getAvatarUrl, getSignedValueString } from '../utils';
import DreamLineup from './DreamLineup.vue';

export default defineComponent({
  // name: 'ComponentName's
  components: { DreamLineup },
  props: {
    userInfo: {
      type: Object as PropType<DisplayedUserInfo>,
      required: true,
    },
  },

  setup() {
    return { getAvatarUrl, getSignedValueString };
  },
});
</script>

<style lang="scss" scoped>
.my-card {
  color: black;

  .card-header {
    background-color: white;
    box-shadow: -1px -14px 59px -27px rgba(0, 0, 0, 0.75) inset;
    -webkit-box-shadow: -1px -14px 59px -27px rgba(0, 0, 0, 0.75) inset;
    -moz-box-shadow: -1px -14px 59px -27px rgba(0, 0, 0, 0.75) inset;

    .card-header-label {
      font-size: 17.5px;
    }
  }
}
</style>
