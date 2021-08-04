<template>
  <q-page padding>
    <!-- content -->
    <h2>{{ JSON.stringify(draftPicks) }}</h2>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { DraftsApi } from 'src/api/';

export default defineComponent({
  // name: 'PageName'
  setup() {
    let draftPicks = ref();

    onMounted(async () => {
      const draftsApi = new DraftsApi();
      const draftId = '728382747239923712';

      await draftsApi
        .draftDraftIdGet(draftId)
        .catch((err) => {
          console.log('Error getting draft data', err);
        })
        .then((draft) => {
          console.table(draft);
        });

      await draftsApi
        .draftDraftIdPicksGet(draftId)
        .catch((err) => {
          console.log('error getting picks', err);
        })
        .then((picks) => {
          draftPicks.value = picks;
          console.table(picks);
        });
    });

    return { draftPicks };
  },
});
</script>
