<template>
  <q-page class="site-theme font-helvetica row justify-center">
    <div class="col-12">
      <div class="row text-center justify-center">
        <q-input
          v-model="enteredUserId"
          class="col-4 q-pr-sm shadowed"
          label="Enter Sleeper User ID or Draft URL"
          label-color="black"
          bg-color="green-2"
          squared
          outlined
        >
        </q-input>

        <q-select
          class="col-2 shadowed"
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

        <q-btn
          @click="onUserIdSubmitted()"
          class="col-2"
          color="red-5"
          text-color="white"
          unelevated
          label="Go Home"
          no-caps
        />
      </div>
    </div>

    <!-- content -->
  </q-page>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { useRoute } from 'vue-router';
import { defineComponent, ref, computed, watch } from 'vue';
import { DisplayedUserInfo } from 'src/components/models';

const MAX_NUM_TEAMS = 22;

export default defineComponent({
  // name: 'PageName'

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
    const season = 2021;
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

<style lang="scss" scoped>
@import 'src/css/app.scss';

h2 {
  margin: 0;
}

.logo {
  max-width: 10%;
  margin: 0 30px 20px;
}

.center-input {
  background-color: transparent;
}

.site-theme {
  background-color: $theme-background-color;
  color: white;
}
</style>
