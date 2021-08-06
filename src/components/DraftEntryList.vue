<template>
  <div>
    <q-input
      v-model="enteredUserId"
      @keydown.enter.prevent="onUserIdSubmitted(enteredUserId)"
      label="Enter Sleeper User ID"
      filled
    >
    </q-input>
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
    const enteredUserId = ref('204783438698381312');
    const draftUrls = computed(() => store.state.draftIds);

    const onUserIdSubmitted = (userId: string) => {
      if (userId) {
        // void store.dispatch('getDraftData', profileId);
        void store.dispatch('getDraftsFromUserId', userId);
      }
      enteredUserId.value = '';
    };

    const removeDraft = (draftId: string) => {
      if (draftId) {
        store.commit('removeDraft', draftId);
      }
    };

    return {
      enteredUserId,
      onUserIdSubmitted,
      removeDraft,
      draftUrls,
    };
  },
});
</script>
