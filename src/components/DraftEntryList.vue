<template>
  <div>
    <q-input filled v-model="userEnteredDraftUrl" label="League ID">
      <template v-slot:after>
        <q-btn
          color="black"
          label="Add Draft"
          dense
          @click="onDraftSubmitted(userEnteredDraftUrl)"
        />
      </template>
    </q-input>

    <q-list bordered padding>
      <q-item v-for="url in draftUrls" :key="url">
        <q-item-section>
          {{ url }}
        </q-item-section>

        <q-item-section side>
          <q-btn icon="highlight_off" @click="removeDraft(url)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'src/store';
// import { DraftsApi } from 'src/api/';

export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useStore();
    const userEnteredDraftUrl = ref();
    const draftUrls = computed(() => store.state.draftIds);

    const parseIdFromUrl = (url: string): string | undefined => {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      const draftId = url.match(/(?!\/)\d+(?=)/);
      return draftId?.shift();
    };

    const onDraftSubmitted = (sleeperDraftUrl: string) => {
      const draftId = parseIdFromUrl(sleeperDraftUrl);
      if (draftId) {
        store.commit('addDraft', draftId);
      }

      // const draftsApi = new DraftsApi();
      // const draftId = '728382747239923712';

      // await draftsApi
      //   .draftDraftIdGet(draftId)
      //   .catch((err) => {
      //     console.log('Error getting draft data', err);
      //   })
      //   .then((draft) => {
      //     console.table(draft);
      //   });

      // await draftsApi
      //   .draftDraftIdPicksGet(draftId)
      //   .catch((err) => {
      //     console.log('error getting picks', err);
      //   })
      //   .then((picks) => {
      //     draftPicks.value = picks;
      //     console.table(picks);
      //   });
    };

    const removeDraft = (draftId: string) => {
      if (draftId) {
        store.commit('removeDraft', draftId);
      }
    };

    return { userEnteredDraftUrl, onDraftSubmitted, removeDraft, draftUrls };
  },
});
</script>
