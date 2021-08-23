<template>
  <q-page>
    <!-- header -->
    <q-header class="header" elevated height-hint="98">
      <div class="user-input-field row text-center justify-center">
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
          @click="onUserIdSubmitted(enteredUserId, selectedDraftSlot)"
          class="col-2"
          color="red-5"
          text-color="white"
          unelevated
          label="Get Stats"
          no-caps
        />
      </div>

      <q-tabs v-model="selectedTab" align="left" class="tab-bar">
        <q-tab
          v-for="user in userTabs"
          :key="user.user_id"
          :name="user.user_id"
        >
          <div class="row">
            <span class="q-pr-sm">{{ user.display_name }}</span>
            <q-btn
              @click="closeTab()"
              unelevated
              round
              class="tab-close all-pointer-events"
              icon="close"
              size=".5rem"
              glossy
            />
          </div>
        </q-tab>
      </q-tabs>
    </q-header>

    <!-- content -->
    <q-tab-panels class="tab-page" v-model="selectedTab" animated>
      <q-tab-panel
        v-for="user in userTabs"
        :key="user.user_id"
        :name="user.user_id"
        class="user-tab-panel"
      >
        <div v-if="userIsLoading(user.user_id)">
          <user-report-skeleton />
        </div>
        <div v-if="!userIsLoading(user.user_id)">
          <user-report :userInfo="user" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { useRoute } from 'vue-router';
import { defineComponent, ref, computed, watch } from 'vue';
import { DisplayedUserInfo } from 'src/components/models';
import UserReportSkeleton from 'src/components/v2/skeletons/UserReportSkeleton.vue';
import UserReport from 'src/components/v2/UserReport.vue';

const MAX_NUM_TEAMS = 22;

export default defineComponent({
  // name: 'PageName'
  components: { UserReportSkeleton, UserReport },
  setup() {
    const store = useStore();
    const route = useRoute();

    const selectedTab = ref('CodeMonkey');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersToAnalyze = computed(() => store.getters.displayedUserInfo);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const usersLoading = computed(() => store.getters.usersLoading);

    const userTabs = computed(() => {
      const loaded: DisplayedUserInfo[] =
        usersToAnalyze.value as DisplayedUserInfo[];
      const loading: DisplayedUserInfo[] =
        usersLoading.value as DisplayedUserInfo[];
      const submittedUsers = new Set<DisplayedUserInfo>();

      loaded.forEach((loadedUser) => submittedUsers.add(loadedUser));
      loading.forEach((loadingUser) => submittedUsers.add(loadingUser));

      return [...submittedUsers];
    });

    const userIsLoading = (userId: string) => {
      const loading: DisplayedUserInfo[] =
        usersLoading.value as DisplayedUserInfo[];
      return loading.find((user) => user.user_id === userId);
    };

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

          selectedTab.value = userId;
        } else {
          void store.dispatch('getDraftsFromUserId', {
            userId,
            season,
            draftSlot,
            privateDraftsOnly: privateDraftsOnly.value,
          });

          selectedTab.value = userId;
        }
      }
      enteredUserId.value = '';
    };

    const removeDraft = (draftId: string) => {
      if (draftId) {
        store.commit('removeDraft', draftId);
      }
    };

    const closeTab = () => {
      console.log('Closing a tab');
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
      closeTab,
      selectedTab,
      userTabs,
      userIsLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/css/app.scss';

h2 {
  margin: 0;
}

.user-input-field {
  padding: 10px 0;
  box-shadow: inset 0px 0px 20px 4px rgb(24 28 40 / 54%);
}

.header {
  background-color: $theme-sleeper-blue;
  .user-input-field {
    padding: 10px 0;
  }

  .tab-bar {
    background-color: $theme-sleeper-dark-blue;

    .tab {
      width: 40px;
    }

    .tab-close {
      background-color: $theme-sleeper-green;
    }
  }
}

.tab-page {
  min-height: inherit;
  background-color: $theme-sleeper-blue;
  box-shadow: inset 0px 0px 20px 12px rgb(24 28 40 / 54%);

  // .user-tab-panel {
  // }
}
</style>
