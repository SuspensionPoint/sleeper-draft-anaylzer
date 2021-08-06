<template>
  <q-page padding>
    <!-- content -->
    <h1 class="text-center">Draft Analyzer</h1>

    <div>
      <h5 class="example">Example URL:</h5>
      <span> https://sleeper.app/draft/nfl/729087749361090560</span>
    </div>

    <draft-entry-list />
    <h4 v-for="entry in valuesToDisplay" :key="entry">{{ entry }}</h4>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DraftEntryList from 'src/components/DraftEntryList.vue';
import { useStore } from 'src/store';

export default defineComponent({
  components: { DraftEntryList },
  // name: 'PageName'
  setup() {
    const store = useStore();
    const valuesToDisplay = ref(store.state.draftIds);

    return { valuesToDisplay };
  },
});
</script>

<style lang="scss">
.example {
  display: inline;
}
</style>
