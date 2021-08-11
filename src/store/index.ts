import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { DraftsApi, Pick, UserApi, Player, Draft } from 'src/api/';
import {
  DisplayedUserInfo,
  DisplayedPick,
  DisplayedPlayer,
  PlayerADP,
  MostDraftedPlayer,
  Reach,
} from 'src/components/models';
import playersJson from '../../players.json';
import playersAdpJson from '../../player-adp.json';
import _, { Dictionary } from 'lodash';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

const DEFAULT_HIGH_ADP = 9999;
const REACH_THRESHOLD = -6;

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  sport: string;
  season: number;
  draftIds: Set<string>;
  idToPlayerName: Map<string, string>;
  userInfo: DisplayedUserInfo[];
  players: Record<string, Player>;
  playersAdp: PlayerADP[];
}

const getPlayerAdp = (
  state: StateInterface,
  player: Player
): PlayerADP | undefined => {
  const playerAdpSearchKey = `${player.first_name} ${player.last_name} ${player.position} ${player.team}`;
  const playerAdpInfo = state.playersAdp.find(
    (p) => `${p.name} ${p.position} ${p.team}` === playerAdpSearchKey
  );

  return playerAdpInfo;
};

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
      sport: 'nfl',
      season: 2021,
      draftIds: new Set<string>(),
      idToPlayerName: new Map<string, string>([
        // ['572842365927186432', 'Gurnels'],
        ['316081473281073152', 'Bradley'],
        ['204783438698381312', 'Chance'],
        ['604119831180005376', 'Jeremy'],
        ['473990600014688256', 'Carby'],
        ['336412440432500736', 'Wesley'],
        ['78926378946674688', 'Austin'],
        ['316088883303440384', 'Garrett'],
        ['730942499283132416', 'Corbin'],
      ]),
      userInfo: [],
      players: playersJson as unknown as Record<string, Player>,
      playersAdp: playersAdpJson.players as PlayerADP[],
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
        if (state.userInfo.find((user) => user.user_id === userId)) {
          console.error(`User with id ${userId} already loaded`);
          return;
        }

        const draftsApi = new DraftsApi();
        const userApi = new UserApi();

        const draftResponse = await draftsApi.userUserIdDraftsSportSeasonGet(
          userId,
          state.sport,
          state.season
        );

        if (draftResponse.data) {
          const drafts = draftResponse.data;
          const userResponse = await userApi.userUserIdGet(userId);
          if (userResponse.data) {
            const user = userResponse.data;
            const allPicksFromUser: DisplayedPick[] = [];
            for (const draft of drafts) {
              const allPicksResponse = await draftsApi.draftDraftIdPicksGet(
                draft.draft_id
              );
              if (allPicksResponse.data) {
                const allPicks = allPicksResponse.data;
                const usersPicksForThisDraft: Pick[] = allPicks.filter(
                  (pick) => pick.picked_by === user.user_id
                );

                for (const userPick of usersPicksForThisDraft) {
                  const player = state.players[userPick.player_id];
                  const playerAdpInfo = getPlayerAdp(state, player);
                  const displayPlayer = playerAdpInfo
                    ? {
                        ...player,
                        full_name: `${player.first_name} ${player.last_name}`,
                        adp: playerAdpInfo.adp,
                        adp_formatted: playerAdpInfo.adp_formatted,
                      }
                    : {
                        ...player,
                        full_name: `${player.first_name} ${player.last_name}`,
                      };

                  if (player) {
                    allPicksFromUser.push({
                      ...userPick,
                      player: displayPlayer,
                      draftTeamCount: draft.settings.teams,
                    });
                  }
                }
              }
            }

            const playerToPickHistory = _.groupBy(
              allPicksFromUser,
              'player_id'
            );

            const mostDraftedPlayer: MostDraftedPlayer = {
              player: {} as DisplayedPlayer,
              draftedCount: 0,
            };

            let biggestReach: Reach = {
              pick: {},
              picksAboveAdp: DEFAULT_HIGH_ADP, // really big #
              draftedCount: 0,
            } as Reach;

            let mostCommonReach: Reach = {
              pick: {},
              picksAboveAdp: DEFAULT_HIGH_ADP, // really big #
              draftedCount: 0,
            } as Reach;

            let totalPickValue = 0;
            let totalNumPicks = 0;

            const reachMap = {} as Dictionary<Reach[]>;

            for (const key in playerToPickHistory) {
              const pickArray = playerToPickHistory[key];
              const player = pickArray[0].player;
              const playerAdp = player.adp;

              if (pickArray.length > mostDraftedPlayer.draftedCount) {
                mostDraftedPlayer.draftedCount = pickArray.length;
                mostDraftedPlayer.player = player;
              }

              if (playerAdp) {
                let highestDraftPick = pickArray[0];
                for (const pick of pickArray) {
                  if (pick.pick_no < highestDraftPick.pick_no) {
                    highestDraftPick = pick;
                  }

                  totalPickValue += pick.pick_no - playerAdp;
                  totalNumPicks++;

                  const diffFromAdp = pick.pick_no - playerAdp;
                  // A reach must have a negative difference
                  if (diffFromAdp < REACH_THRESHOLD) {
                    if (reachMap[player.player_id]) {
                      reachMap[player.player_id].push({
                        pick,
                        picksAboveAdp: Math.round(diffFromAdp),
                        draftedCount: pickArray.length,
                      });
                    } else {
                      reachMap[player.player_id] = [
                        {
                          pick,
                          picksAboveAdp: Math.round(diffFromAdp),
                          draftedCount: pickArray.length,
                        } as Reach,
                      ];
                    }
                  }
                }

                const diffFromAdpHighest = highestDraftPick.pick_no - playerAdp;
                // A reach must have a negative difference
                if (diffFromAdpHighest < REACH_THRESHOLD) {
                  if (diffFromAdpHighest < biggestReach.picksAboveAdp) {
                    biggestReach = {
                      pick: highestDraftPick,
                      picksAboveAdp: Math.round(diffFromAdpHighest),
                      draftedCount: pickArray.length,
                    };
                  }
                }
              }
            }

            let reachCounter = 0;
            for (const player_id in reachMap) {
              const reachList = reachMap[player_id];
              const reach = reachMap[player_id][0];
              const avgPicksAboveAdp = _.mean(
                reachList.map((r) => r.picksAboveAdp)
              );

              if (reachList.length > reachCounter) {
                reachCounter = reachList.length;
                mostCommonReach = {
                  pick: reach.pick,
                  picksAboveAdp: avgPicksAboveAdp,
                  draftedCount: reach.draftedCount,
                };
              }
            }

            commit('addUserInfo', {
              ...user,
              picks: allPicksFromUser,
              analysis: {
                biggestReach:
                  biggestReach.picksAboveAdp != DEFAULT_HIGH_ADP
                    ? biggestReach
                    : undefined,
                mostCommonReach:
                  mostCommonReach.picksAboveAdp != DEFAULT_HIGH_ADP
                    ? mostCommonReach
                    : undefined,
                mostDraftedPlayer,
                averagePickValue: totalPickValue / totalNumPicks,
              },
            });

            console.log('All user info:', state.userInfo);
          }
        }
      },

      async getUserInfoFromDraft({ dispatch }, draftId: string) {
        const draftsApi = new DraftsApi();

        const draftResponse = await draftsApi.draftDraftIdGet(draftId);
        if (draftResponse.data) {
          const draft: Draft = draftResponse.data as unknown as Draft;
          const draftOrder = _.keys(draft.draft_order);
          draftOrder.forEach(
            (userId) => void dispatch('getDraftsFromUserId', userId)
          );
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
