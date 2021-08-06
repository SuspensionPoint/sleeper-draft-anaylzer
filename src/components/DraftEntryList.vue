<template>
  <div>
    <q-input
      v-model="userEnteredProfileId"
      @keydown.enter.prevent="onDraftSubmitted(userEnteredProfileId)"
      label="Enter Sleeper Profile ID"
      filled
    >
    </q-input>

    <q-list bordered padding>
      <q-item v-if="draftUrls.size <= 0" disable>
        <q-item-section> No drafts added </q-item-section>
      </q-item>

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
    const userEnteredProfileId = ref(
      'https://sleeper.app/draft/nfl/729087749361090560'
    );
    const draftUrls = computed(() => store.state.draftIds);

    const parseIdFromUrl = (url: string): string | undefined => {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      const draftId = url.match(/(?!\/)\d+(?=)/);
      return draftId?.shift();
    };

    const onDraftSubmitted = (sleeperDraftUrl: string) => {
      const draftId = parseIdFromUrl(sleeperDraftUrl);
      if (draftId) {
        void store.dispatch('getDraftData', draftId);
      }
      userEnteredProfileId.value = '';
    };

    const removeDraft = (draftId: string) => {
      if (draftId) {
        store.commit('removeDraft', draftId);
      }
    };

    return {
      userEnteredProfileId,
      onDraftSubmitted,
      removeDraft,
      draftUrls,
    };
  },
});
</script>
