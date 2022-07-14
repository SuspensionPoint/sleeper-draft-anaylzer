<template>
  <div class="row justify-between">
    <q-input
      v-model="enteredUserId"
      class="col-7 q-pr-sm shadowed"
      @keydown.enter.prevent="
        onUserIdSubmitted(enteredUserId, selectedDraftSlot)
      "
      label="Enter Sleeper User ID or Draft URL"
      label-color="black"
      bg-color="green-2"
      squared
      outlined
    >
    </q-input>

    <q-select
      class="col-3 shadowed"
      v-model="selectedDraftSlot"
      :options="draftSlotOptions"
      label="Draft Slot"
      label-color="black"
      bg-color="green-2"
      squared
      outlined
    >
    </q-select>

    <q-checkbox
      class="col-2 checkbox"
      dark
      v-model="privateDraftsOnly"
      label="Private Drafts Only"
      color="green-2"
    />
  </div>

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

const MAX_NUM_TEAMS = 22;

export default defineComponent({
  components: { UserAnalysisCard },
  // name: 'ComponentName'
  setup() {
    const store = useStore();
    const route = useRoute();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersToAnalyze = computed(() => store.getters.displayedUserInfo);
    const enteredUserId = ref('202523901442392064');
    const selectedDraftSlot = ref('All');
    const teamNumberStrings = [...Array(MAX_NUM_TEAMS).keys()]
      .map((a) => a + 1)
      .map((k) => String(k));
    const draftSlotOptions = ['All', ...teamNumberStrings];
    const privateDraftsOnly = ref(false);

    // Track entered userIds
    watch(usersToAnalyze.value, () => {
      const infoList: DisplayedUserInfo[] =
        usersToAnalyze.value as DisplayedUserInfo[];
      const idList = infoList.map((info) => {
        return `${info.user_id}:${info.draftSlot}:${
          info.privateDraftsOnly ? 'PrivateOnly' : 'Public'
        }`;
      });
      const idListSet = new Set<string>();
      const path = route.path;

      idList.forEach((id) => {
        if (!path.includes(id)) {
          idListSet.add(id);
        }
      });

      const newIdsToLoad = [...idListSet].join(',');
      if (!path.includes('/report/')) {
        const url = window.location.origin + '#/report' + path;
        history.pushState(null, 'Sleeper Stats', url + newIdsToLoad);
      } else {
        const url = window.location.origin + '/#' + path;
        history.pushState(null, 'Sleeper Stats', url + ',' + newIdsToLoad);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersLoading = computed(() => store.getters.usersLoading);
    const season = 2022;
    const onUserIdSubmitted = (userId: string, draftSlot: string) => {
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const isDraftUrl = userId.match(/(?!\/)\d+(?=)/);
        if (userId.includes('/') && isDraftUrl) {
          void store.dispatch('getUserInfoFromDraft', {
            draftId: isDraftUrl.shift(),
            privateDraftsOnly: privateDraftsOnly.value,
          });
        } else {
          void store.dispatch('getDraftsFromUserId', {
            userId,
            season,
            draftSlot,
            privateDraftsOnly: privateDraftsOnly.value,
          });
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
      selectedDraftSlot,
      draftSlotOptions,
      privateDraftsOnly,
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

.checkbox {
  text-align: center;
  color: white;
}
</style>
