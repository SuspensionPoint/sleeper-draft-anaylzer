import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { DraftsApi, Pick } from 'src/api/';

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

export type DraftPickTracker = Record<string, Record<string, Pick[]>>;

export interface StateInterface {
  draftIds: Set<string>;
  idToPlayerName: Map<string, string>;
  idToDraftPicks: DraftPickTracker;
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
      idToDraftPicks: {},
    },

    actions: {
      gatherTheBoisData({ dispatch, state }) {
        state.idToPlayerName.forEach((value: string, key: string) => {
          dispatch('getDraftsFromUserId', key).catch((err) => {
            console.log('Error gathering the boys data:', err);
          });
        });
      },

      async getDraftsFromUserId({ dispatch }, userId: string) {
        const draftsApi = new DraftsApi();

        const sport = 'nfl';
        const season = 2021;
        await draftsApi
          .userUserIdDraftsSportSeasonGet(userId, sport, season)
          .catch((err) => {
            console.log(
              `error getting drafts for id:[${userId}] \n error: `,
              err
            );
          })
          .then((response) => {
            if (response && response.data) {
              console.log(`Chance's Drafts From ${season}:`, response.data);

              response.data.forEach((draft) => {
                void dispatch('getDraftData', {
                  draftId: draft.draft_id,
                  forUserId: userId,
                });
              });
            }
          });
      },

      async getDraftData(
        { commit },
        payload: { draftId: string; forUserId?: string }
      ) {
        const draftsApi = new DraftsApi();

        await draftsApi
          .draftDraftIdPicksGet(payload.draftId)
          .catch((err) => {
            console.log(
              `error getting draft data for id:[${payload.draftId}] \n error: `,
              err
            );
          })
          .then((response) => {
            if (response) {
              // commit('addDraft', draftId);
              commit('addDraftPicks', {
                picks: response.data,
                forUserId: payload.forUserId,
              });
            }
          });
      },
    },

    mutations: {
      addDraft(state, id: string) {
        state.draftIds.add(id);
      },

      removeDraft(state, id: string) {
        state.draftIds.delete(id);
      },

      addDraftPicks(state, payload: { picks: Pick[]; forUserId?: string }) {
        payload.picks.forEach((pick) => {
          if (pick.picked_by != '') {
            // If filtering by a specific user and the current pick is not that user
            // skip the pick
            if (payload.forUserId && payload.forUserId !== pick.picked_by) {
              return;
            }

            // This is the user's first pick that we've tracked
            // OR
            // This is the first time a user has drafted the particular player
            if (
              !state.idToDraftPicks[pick.picked_by] ||
              !state.idToDraftPicks[pick.picked_by][pick.player_id]
            ) {
              state.idToDraftPicks[pick.picked_by] = {
                ...state.idToDraftPicks[pick.picked_by],
                [pick.player_id]: [pick],
              };
              state.idToDraftPicks[pick.picked_by][pick.player_id];
            } else {
              state.idToDraftPicks[pick.picked_by][pick.player_id].push(pick);
            }
          }
        });

        console.log('tracker: ', state.idToDraftPicks);
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
