<template>
  <q-page class="site-theme font-helvetica">
    <div class="col-12">
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

      <div>
        <q-tabs v-model="selectedTab" align="left" class="tab-bar">
          <q-tab name="CodeMonkey">
            <div class="row">
              <span class="q-pr-sm">CodeMonkey</span>
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
          <q-tab name="alarms" label="Alarms" />
          <q-tab v-if="$q.screen.gt.sm" name="movies" label="Movies" />
          <q-tab v-if="$q.screen.gt.sm" name="photos" label="Photos" />
        </q-tabs>
      </div>
    </div>

    <!-- content -->
    <div class="full-height col-12">
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel class="user-tab-panel" name="CodeMonkey">
          <div class="text-h6">Mails</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel class="user-tab-panel" name="alarms">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </div>
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
    const selectedTab = ref('CodeMonkey');

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

.user-tab-panel {
  // background-color: $theme-sleeper-blue;
  background-color: red;
  box-shadow: -7px 7px 14px 0px rgb(58 58 58 / 75%);
}

å .logo {
  max-width: 10%;
  margin: 0 30px 20px;
}

.center-input {
  background-color: transparent;
}

.site-theme {
  background-color: $theme-sleeper-blue;
  color: white;
}
</style>
