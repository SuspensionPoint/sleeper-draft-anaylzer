<template>
  <q-input
    v-model="enteredUserId"
    @keydown.enter.prevent="onUserIdSubmitted(enteredUserId)"
    label="Enter Sleeper User ID or Draft URL"
    filled
  >
  </q-input>

  <div
    v-if="usersToAnalyze && usersToAnalyze.length > 0"
    class="q-pa-md row items-start justify-between q-gutter-y-xl"
  >
    <user-analysis-card
      v-for="user in usersToAnalyze"
      :key="user.user_id"
      :userInfo="user"
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersToAnalyze = computed(() => store.getters.displayedUserInfo);

    const onUserIdSubmitted = (userId: string) => {
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const isDraftUrl = userId.match(/(?!\/)\d+(?=)/);
        if (isDraftUrl) {
          void store.dispatch('getUserInfoFromDraft', isDraftUrl.shift());
        }

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
