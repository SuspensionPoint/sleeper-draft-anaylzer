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
      class="col-12 col-md-6 shadowed"
    />

    <div
      v-for="loadingUser in usersLoading"
      :key="`loading-${loadingUser.user_id}`"
      class="loading-card col-12 col-md-6"
    >
      <q-skeleton
        height="145px"
        class="bg-blue-teal-10"
        square
        animation="pulse-y"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'src/store';
import { useRoute } from 'vue-router';
import UserAnalysisCard from 'src/components/UserAnalysisCard.vue';
import { DisplayedUserInfo } from './models';

export default defineComponent({
  components: { UserAnalysisCard },
  // name: 'ComponentName'
  setup() {
    const store = useStore();
    const route = useRoute();
    const enteredUserId = ref('202523901442392064');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersToAnalyze = computed(() => store.getters.displayedUserInfo);

    // Track entered userIds
    watch(usersToAnalyze.value, () => {
      const infoList: DisplayedUserInfo[] =
        usersToAnalyze.value as DisplayedUserInfo[];
      const idList = infoList.map((info) => info.user_id).join(',');
      const path = route.path;

      if (!path.includes('/report/')) {
        const url = window.location.origin + `#/report/${2020}` + path;
        history.pushState(null, 'Sleeper Stats', url + idList);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersLoading = computed(() => store.getters.usersLoading);

    const onUserIdSubmitted = (userId: string) => {
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const isDraftUrl = userId.match(/(?!\/)\d+(?=)/);
        if (userId.includes('/') && isDraftUrl) {
          void store.dispatch('getUserInfoFromDraft', isDraftUrl.shift());
        } else {
          void store.dispatch('getDraftsFromUserId', { userId, year: 2020 });
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
.q-field--float .q-field__label {
  font-weight: bold;
}

.loading-card {
  width: 45%;
}

.shadowed {
  box-shadow: -7px 7px 14px 0px #191527;
}
</style>
