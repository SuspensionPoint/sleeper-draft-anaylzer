import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { DraftsApi } from 'src/api/';

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
  sleeperIdToPlayerName: Map<string, string>;
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
      sleeperIdToPlayerName: new Map<string, string>([
        ['316081473281073152', 'Austin'],
        ['204783438698381312', 'Bradley'],
        ['604119831180005376', 'Chance'],
        ['473990600014688256', 'Carby'],
        ['336412440432500736', 'Wesley'],
      ]),
    },

    actions: {
      async getDraftData({ commit }, draftId: string) {
        const draftsApi = new DraftsApi();

        await draftsApi
          .draftDraftIdPicksGet(draftId)
          .catch((err) => {
            console.log(
              `error getting draft data for id:[${draftId}] \n error: `,
              err
            );
          })
          .then((picks) => {
            commit('addDraft', draftId);
            console.table(picks);
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
