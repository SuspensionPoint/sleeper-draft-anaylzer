<template>
  <div class="col">
    <div class="row no-wrap justify-center">
      <div v-for="index in count" :key="index">
        <div class="col">
          <div class="row justify-center">
            <q-skeleton type="text" square width="105px" animation="fade" />
          </div>
          <div class="row justify-center">
            <q-skeleton type="text" square width="105px" animation="fade" />
          </div>

          <div class="row q-mt-md">
            <q-skeleton
              class="q-mx-xl"
              size="56px"
              type="QAvatar"
              animation="fade"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
export default defineComponent({
  // name: 'ComponentName'
  props: {
    numberOfPlayers: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const count = computed(() => props.numberOfPlayers);

    return { count };
  },
});
</script>
