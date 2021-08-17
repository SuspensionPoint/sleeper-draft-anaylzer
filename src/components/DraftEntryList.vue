<template>
  <q-input
    v-model="enteredUserId"
    class="shadowed"
    @keydown.enter.prevent="onUserIdSubmitted(enteredUserId)"
    label="Enter Sleeper User ID or Draft URL"
    label-color="black"
    bg-color="green-2"
    squared
    outlined
  >
  </q-input>

  <div class="q-pa-md row items-start justify-between q-gutter-y-xl">
    <user-analysis-card
      v-for="user in usersToAnalyze"
      :key="user.user_id"
      :userInfo="user"
      class="col-12 col-md-6 analysis-list shadowed"
    />

    <div
      v-for="loadingUser in usersLoading"
      :key="`loading-${loadingUser.user_id}`"
      class="loading-card col-12 col-md-6 shadowed"
    >
      <q-card flat>
        <q-skeleton height="145px" square />
      </q-card>
    </div>
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
    const enteredUserId = ref('202523901442392064');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersToAnalyze = computed(() => store.getters.displayedUserInfo);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersLoading = computed(() => store.getters.usersLoading);

    const onUserIdSubmitted = (userId: string) => {
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const isDraftUrl = userId.match(/(?!\/)\d+(?=)/);
        if (userId.includes('/') && isDraftUrl) {
          void store.dispatch('getUserInfoFromDraft', isDraftUrl.shift());
        } else {
          void store.dispatch('getDraftsFromUserId', userId);
        }
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
      usersLoading,
    };
  },
});
</script>

<style lang="scss">
.loading-card {
  width: 45%;
}

.analysis-list {
  padding: 10px;
}

.shadowed {
  box-shadow: -7px 7px 14px 0px rgb(58 58 58 / 75%);
}
</style>
