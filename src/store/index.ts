import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { DraftsApi, Pick, UserApi } from 'src/api/';
import { DisplayedUserInfo } from 'src/components/models';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  draftIds: Set<string>;
  idToPlayerName: Map<string, string>;
  userInfo: DisplayedUserInfo[];
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol('vuex-key');

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    state: {
      draftIds: new Set<string>(),
      idToPlayerName: new Map<string, string>([
        ['316081473281073152', 'Bradley'],
        ['204783438698381312', 'Chance'],
        ['604119831180005376', 'Jeremy'],
        ['473990600014688256', 'Carby'],
        ['336412440432500736', 'Wesley'],
      ]),
      userInfo: [],
    },

    actions: {
      gatherTheBoisData({ dispatch, state }) {
        state.idToPlayerName.forEach((value: string, key: string) => {
          dispatch('getDraftsFromUserId', key).catch((err) => {
            console.log('Error gathering the boys data:', err);
          });
        });
      },

      async getDraftsFromUserId({ commit, state }, userId: string) {
        const draftsApi = new DraftsApi();
        const userApi = new UserApi();

        const sport = 'nfl';
        const season = 2021;

        const draftResponse = await draftsApi.userUserIdDraftsSportSeasonGet(
          userId,
          sport,
          season
        );
        if (draftResponse.data) {
          const drafts = draftResponse.data;
          const userResponse = await userApi.userUserIdGet(userId);
          if (userResponse.data) {
            const user = userResponse.data;
            const allPicksFromUser: Pick[] = [];
            for (const draft of drafts) {
              const allPicksResponse = await draftsApi.draftDraftIdPicksGet(
                draft.draft_id
              );
              if (allPicksResponse.data) {
                const allPicks = allPicksResponse.data;
                const usersPicksForThisDraft: Pick[] = allPicks.filter(
                  (pick) => pick.picked_by === user.user_id
                );

                allPicksFromUser.push(...usersPicksForThisDraft);
              }
            }

            commit('addUserInfo', {
              ...user,
              picks: allPicksFromUser,
            });

            console.log('All user info:', state.userInfo);
          }
        }
      },
    },

    mutations: {
      addUserInfo(state, userInfo: DisplayedUserInfo) {
        state.userInfo.push(userInfo);
      },
    },

    getters: {
      displayedUserInfo: (state): DisplayedUserInfo[] => {
        return state.userInfo;
      },
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
