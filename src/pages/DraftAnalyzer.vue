<template>
  <q-page padding>
    <!-- content -->
    <!-- <h1 class="text-center">Draft Analyzer</h1> -->
    <draft-entry-list />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DraftEntryList from 'src/components/DraftEntryList.vue';
import { useStore } from 'src/store';

export default defineComponent({
  components: { DraftEntryList },
  // name: 'PageName'
  setup() {
    const store = useStore();
    void store.dispatch('gatherTheBoisData');
  },
});
</script>

<style lang="scss">
</style>
