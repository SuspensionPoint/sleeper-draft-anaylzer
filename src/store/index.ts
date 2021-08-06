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
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  draftIds: Set<string>;
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
