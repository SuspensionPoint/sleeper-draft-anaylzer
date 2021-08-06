<template>
  <q-input
    v-model="enteredUserId"
    @keydown.enter.prevent="onUserIdSubmitted(enteredUserId)"
    label="Enter Sleeper User ID"
    filled
  >
  </q-input>

  <div class="q-pa-md row items-start q-gutter-md">
    <user-analysis-card
      v-for="[key] in Object.entries(usersToAnalyze)"
      :key="key"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'src/store';
import UserAnalysisCard from 'src/components/UserAnalysisCard.vue';

export default defineComponent({
  components: { UserAnalysisCard },
  // name: 'ComponentName'
  setup() {
    const store = useStore();
    const enteredUserId = ref('204783438698381312');
    const usersToAnalyze = computed(() => store.state.idToDraftPicks);

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
      usersToAnalyze,
    };
  },
});
</script>
