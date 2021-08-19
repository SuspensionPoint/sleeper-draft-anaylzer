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
  DisplayedPlayer,
  PlayerADP,
  MostDraftedPlayer,
  Reach,
  FavoritePositionalPick,
  DisplayedPick,
  RoundAnalysis,
  DraftPositionDistribution,
  MostDraftedAtPosition,
} from 'src/components/models';
import playersJson from '../../players.json';
import playersAdpJson from '../../player-adp.json';
import _, { Dictionary } from 'lodash';
import { AxiosResponse } from 'axios';
import { Notify } from 'quasar';
import { decimalToPercent } from 'src/components/utils';
import { getPickNumbers } from 'src/components/sleeper';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

const DEFAULT_HIGH_ADP = 9999;
const REACH_THRESHOLD = -6;
const REACH_MAX_ROUND = 12;

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
  supportedScoringTypes: string[];
  draftIds: Set<string>;
  idToPlayerName: Map<string, string>;
  userInfo: DisplayedUserInfo[];
  userInfoLoading: string[];
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

const getMostOccuringPlayer = (
  picks: DisplayedPick[]
): MostDraftedPlayer | undefined => {
  if (picks.length < 1) {
    return;
  }

  const idToPickHistory = _.groupBy(picks, 'player_id');
  const mostDraftedPlayer: MostDraftedPlayer = {
    player: {} as DisplayedPlayer,
    draftedCount: 0,
    picks: [],
  };

  for (const key in idToPickHistory) {
    const pickArray = idToPickHistory[key];
    const player = pickArray[0].player;

    if (pickArray.length > mostDraftedPlayer.draftedCount) {
      mostDraftedPlayer.draftedCount = pickArray.length;
      mostDraftedPlayer.player = player;
      mostDraftedPlayer.picks = pickArray;
    }
  }

  return mostDraftedPlayer;
};

const getRoundAnalysis = (
  round: number,
  picks: DisplayedPick[]
): RoundAnalysis => {
  const qbs = picks.filter((p) => p.player.position === 'QB');
  const rbs = picks.filter((p) => p.player.position === 'RB');
  const wrs = picks.filter((p) => p.player.position === 'WR');
  const tes = picks.filter((p) => p.player.position === 'TE');
  const defenses = picks.filter((p) => p.player.position === 'DEF');
  const kickers = picks.filter((p) => p.player.position === 'K');

  const mostCommonQb = getMostOccuringPlayer(qbs);
  const mostCommonRb = getMostOccuringPlayer(rbs);
  const mostCommonWr = getMostOccuringPlayer(wrs);
  const mostCommonTe = getMostOccuringPlayer(tes);
  const mostCommonDef = getMostOccuringPlayer(defenses);
  const mostCommonK = getMostOccuringPlayer(kickers);
  const mostDraftedFromEachPosition: MostDraftedAtPosition = {
    qb: mostCommonQb,
    rb: mostCommonRb,
    wr: mostCommonWr,
    te: mostCommonTe,
    def: mostCommonDef,
    kicker: mostCommonK,
  };

  const totalNumSelections =
    qbs.length +
    rbs.length +
    wrs.length +
    tes.length +
    defenses.length +
    kickers.length;
  const allPositions = [qbs, rbs, wrs, tes, defenses, kickers].filter(
    (arr) => arr.length
  );
  const mostDraftedPlayersOfPositions: MostDraftedPlayer[] = [];

  if (totalNumSelections < 1) {
    return {
      round: round,
      mostDraftedPosition: [],
      mostDraftedPositionCount: 0,
      probabilityToDraftedPosition: 0,
      distribution: {
        quarterback: 0,
        runningback: 0,
        wide_receiver: 0,
        tight_end: 0,
        defense: 0,
        kicker: 0,
      },
      mostDraftedPlayersOfPositions,
      mostDraftedFromEachPosition,
    };
  }

  const distribution: DraftPositionDistribution = {
    quarterback: decimalToPercent(qbs.length / totalNumSelections),
    runningback: decimalToPercent(rbs.length / totalNumSelections),
    wide_receiver: decimalToPercent(wrs.length / totalNumSelections),
    tight_end: decimalToPercent(tes.length / totalNumSelections),
    defense: decimalToPercent(defenses.length / totalNumSelections),
    kicker: decimalToPercent(kickers.length / totalNumSelections),
  };

  const lengthMap = {} as Dictionary<DisplayedPick[]>;
  for (const arr of allPositions) {
    if (arr.length < 1) {
      continue;
    }

    if (lengthMap[arr.length]) {
      lengthMap[arr.length].push(...arr);
    } else {
      lengthMap[arr.length] = [...arr];
    }
  }

  const sortedLengthMap = Object.entries(lengthMap).sort(
    ([, a], [, b]) => b.length - a.length
  );

  const lengthMapKeys = _.keys(lengthMap);
  if (lengthMapKeys.length < allPositions.length) {
    const combined = sortedLengthMap[0][1];
    const positions = [
      ...new Set(combined.map((item) => item.player.position)),
    ];

    positions.forEach((pos) => {
      switch (pos) {
        case 'QB':
          if (mostCommonQb) {
            mostDraftedPlayersOfPositions.push(mostCommonQb);
          }
          break;
        case 'RB':
          if (mostCommonRb) {
            mostDraftedPlayersOfPositions.push(mostCommonRb);
          }
          break;
        case 'WR':
          if (mostCommonWr) {
            mostDraftedPlayersOfPositions.push(mostCommonWr);
          }
          break;
        case 'TE':
          if (mostCommonTe) {
            mostDraftedPlayersOfPositions.push(mostCommonTe);
          }
          break;
        case 'DEF':
          if (mostCommonDef) {
            mostDraftedPlayersOfPositions.push(mostCommonDef);
          }
          break;
        case 'K':
          if (mostCommonK) {
            mostDraftedPlayersOfPositions.push(mostCommonK);
          }
          break;

        default:
          break;
      }
    });

    return {
      round: round,
      mostDraftedPosition: positions,
      mostDraftedPositionCount: combined.length,
      probabilityToDraftedPosition: decimalToPercent(
        combined.length / totalNumSelections
      ),
      distribution,
      mostDraftedPlayersOfPositions,
      mostDraftedFromEachPosition,
    };
  } else {
    const mostCommonPosition =
      allPositions[
        allPositions.reduce((p, c, i, a) => (a[p].length > c.length ? p : i), 0)
      ];

    switch (mostCommonPosition[0].player.position) {
      case 'QB':
        if (mostCommonQb) {
          mostDraftedPlayersOfPositions.push(mostCommonQb);
        }
        break;
      case 'RB':
        if (mostCommonRb) {
          mostDraftedPlayersOfPositions.push(mostCommonRb);
        }
        break;
      case 'WR':
        if (mostCommonWr) {
          mostDraftedPlayersOfPositions.push(mostCommonWr);
        }
        break;
      case 'TE':
        if (mostCommonTe) {
          mostDraftedPlayersOfPositions.push(mostCommonTe);
        }
        break;
      case 'DEF':
        if (mostCommonDef) {
          mostDraftedPlayersOfPositions.push(mostCommonDef);
        }
        break;
      case 'K':
        if (mostCommonK) {
          mostDraftedPlayersOfPositions.push(mostCommonK);
        }
        break;

      default:
        break;
    }

    return {
      round: round,
      mostDraftedPosition: [mostCommonPosition[0].player.position],
      mostDraftedPositionCount: mostCommonPosition.length,
      probabilityToDraftedPosition: Math.round(
        (mostCommonPosition.length / totalNumSelections) * 100
      ),
      distribution,
      mostDraftedPlayersOfPositions,
      mostDraftedFromEachPosition,
    };
  }
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
      supportedScoringTypes: ['ppr', 'std', 'half_ppr', '2qb'],
      draftIds: new Set<string>(),
      idToPlayerName: new Map<string, string>([
        // ['572842365927186432', 'Gurnels'],
        // ['202523901442392064', 'CodeMonkey],
      ]),
      userInfo: [],
      userInfoLoading: [],
      players: playersJson as unknown as Record<string, Player>,
      playersAdp: playersAdpJson.players as PlayerADP[],
    },

    actions: {
      gatherTheBoisData({ dispatch, state }) {
        state.idToPlayerName.forEach((value: string, key: string) => {
          dispatch('getDraftsFromUserId', { userId: key, season: 2021 }).catch(
            (err) => {
              console.log('Error gathering the boys data:', err);
            }
          );
        });
      },

      async getDraftsFromUserId(
        { commit, state },
        { userId, season, draftSlot }
      ) {
        const isLoaded =
          state.userInfo.find((user) => user.user_id === userId) != undefined;
        const isLoading =
          state.userInfoLoading.find((id) => id === userId) != undefined;

        if (isLoaded || isLoading) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          console.error(`User with id ${userId} already loaded`);
          Notify.create({
            position: 'bottom',
            color: 'negative',
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            message: `User with ID ${userId} is already loaded.`,
          });

          return;
        }

        commit('setSeason', season);
        commit('addUserBeingLoaded', userId);

        const draftsApi = new DraftsApi();
        const userApi = new UserApi();
        const draftResponse: AxiosResponse<Draft[]> | void =
          await draftsApi.userUserIdDraftsSportSeasonGet(
            userId,
            state.sport,
            season
          );

        if (draftResponse.data.length > 0) {
          const drafts = draftResponse.data;
          const userResponse = await userApi.userUserIdGet(userId);
          if (userResponse.data) {
            const user = userResponse.data;
            const allPicksFromUser: DisplayedPick[] = [];

            let favoriteQB: FavoritePositionalPick = {
              picks: [],
              position: '',
              avgRoundNumber: 0,
              avgPickNumber: 0,
            };

            let favoriteRB: FavoritePositionalPick = {
              picks: [],
              position: '',
              avgRoundNumber: 0,
              avgPickNumber: 0,
            };

            let favoriteWR: FavoritePositionalPick = {
              picks: [],
              position: '',
              avgRoundNumber: 0,
              avgPickNumber: 0,
            };

            let favoriteTE: FavoritePositionalPick = {
              picks: [],
              position: '',
              avgRoundNumber: 0,
              avgPickNumber: 0,
            };

            // Track rounds that the user has made a selection in
            const roundsDraftedIn = new Set<number>();

            for (const draft of drafts) {
              // For now, skip non-supported scoring types.
              // Can go back and update this to use proper ADPs for those leagues later.
              if (
                !state.supportedScoringTypes.includes(
                  draft.metadata.scoring_type
                )
              ) {
                continue;
              }

              const allPicksResponse = await draftsApi.draftDraftIdPicksGet(
                draft.draft_id
              );
              if (allPicksResponse.data) {
                const allPicks = allPicksResponse.data;
                const usersPicksForThisDraft: Pick[] = allPicks.filter(
                  (pick) => pick.picked_by === user.user_id
                );
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const pickNumber = draftSlot;
                const numTeams = draft.settings.teams;
                const picksToAnalyze =
                  pickNumber === 'All'
                    ? undefined
                    : getPickNumbers(
                        Number(pickNumber),
                        numTeams,
                        draft.settings.rounds
                      );

                for (const userPick of usersPicksForThisDraft) {
                  if (
                    !picksToAnalyze ||
                    (picksToAnalyze &&
                      picksToAnalyze.includes(userPick.pick_no))
                  ) {
                    const player = state.players[userPick.player_id];
                    roundsDraftedIn.add(userPick.round);

                    // todo: make this more dynamic buy using:
                    // https://api.sleeper.app/projections/nfl/2021?season_type=regular&position[]=DEF&position[]=K&position[]=QB&position[]=RB&position[]=TE&position[]=WR&order_by=adp_half_ppr
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
            }

            const playerToPickHistory = _.groupBy(
              allPicksFromUser,
              'player_id'
            );

            const mostDraftedPlayer: MostDraftedPlayer = {
              player: {} as DisplayedPlayer,
              draftedCount: 0,
              picks: [],
            };

            const topFiveReaches: Reach[] = [];

            let biggestReach: Reach = {
              picks: [],
              picksAboveAdp: DEFAULT_HIGH_ADP, // really big #
              draftedCount: 0,
            } as Reach;

            let mostCommonReach: Reach = {
              picks: [],
              picksAboveAdp: DEFAULT_HIGH_ADP, // really big #
              draftedCount: 0,
            } as Reach;

            let totalPickValue = 0;
            let totalNumPicks = 0;

            const reachMap = {} as Dictionary<Reach[]>;

            const roundMap = {} as Dictionary<DisplayedPick[]>;

            for (const key in playerToPickHistory) {
              const pickArray = playerToPickHistory[key];
              const player = pickArray[0].player;
              const playerAdp = player.adp;

              if (pickArray.length > mostDraftedPlayer.draftedCount) {
                mostDraftedPlayer.draftedCount = pickArray.length;
                mostDraftedPlayer.player = player;
                mostDraftedPlayer.picks = pickArray;
              }

              switch (player.position) {
                case 'QB': {
                  if (pickArray.length > favoriteQB.picks.length) {
                    favoriteQB = {
                      player,
                      picks: pickArray,
                      position: player.position,
                      avgRoundNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.round))
                      ),
                      avgPickNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.pick_no))
                      ),
                    };
                  }
                  break;
                }
                case 'RB': {
                  if (pickArray.length > favoriteRB.picks.length) {
                    favoriteRB = {
                      player,
                      picks: pickArray,
                      position: player.position,
                      avgRoundNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.round))
                      ),
                      avgPickNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.pick_no))
                      ),
                    };
                  }
                  break;
                }
                case 'WR': {
                  if (pickArray.length > favoriteWR.picks.length) {
                    favoriteWR = {
                      player,
                      picks: pickArray,
                      position: player.position,
                      avgRoundNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.round))
                      ),
                      avgPickNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.pick_no))
                      ),
                    };
                  }
                  break;
                }
                case 'TE': {
                  if (pickArray.length > favoriteTE.picks.length) {
                    favoriteTE = {
                      player,
                      picks: pickArray,
                      position: player.position,
                      avgRoundNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.round))
                      ),
                      avgPickNumber: Math.ceil(
                        _.mean(pickArray.map((p) => p.pick_no))
                      ),
                    };
                  }
                  break;
                }
                default:
                  break;
              }

              if (playerAdp) {
                let highestDraftPick = pickArray[0];
                for (const pick of pickArray) {
                  // Add to pick round tracking
                  if (roundMap[pick.round]) {
                    roundMap[pick.round].push(pick);
                  } else {
                    roundMap[pick.round] = [pick];
                  }

                  if (pick.pick_no < highestDraftPick.pick_no) {
                    highestDraftPick = pick;
                  }

                  totalPickValue += pick.pick_no - playerAdp;
                  totalNumPicks++;

                  const diffFromAdp = pick.pick_no - playerAdp;
                  // A reach must have a negative difference
                  if (
                    diffFromAdp < REACH_THRESHOLD &&
                    pick.round < REACH_MAX_ROUND
                  ) {
                    if (reachMap[player.player_id]) {
                      reachMap[player.player_id].push({
                        picks: [pick],
                        picksAboveAdp: Math.round(diffFromAdp),
                        draftedCount: pickArray.length,
                      });
                    } else {
                      reachMap[player.player_id] = [
                        {
                          picks: [pick],
                          picksAboveAdp: Math.round(diffFromAdp),
                          draftedCount: pickArray.length,
                        } as Reach,
                      ];
                    }
                  }
                }

                const diffFromAdpHighest = highestDraftPick.pick_no - playerAdp;
                // A reach must have a negative difference
                if (
                  diffFromAdpHighest < REACH_THRESHOLD &&
                  highestDraftPick.round < REACH_MAX_ROUND
                ) {
                  if (diffFromAdpHighest < biggestReach.picksAboveAdp) {
                    biggestReach = {
                      picks: [highestDraftPick],
                      picksAboveAdp: Math.round(diffFromAdpHighest),
                      draftedCount: pickArray.length,
                    };

                    if (highestDraftPick.player.adp) {
                      biggestReach.roundNumber = Math.ceil(
                        highestDraftPick.pick_no /
                          highestDraftPick.draftTeamCount
                      );
                      biggestReach.pickNumber = Math.round(
                        (biggestReach.picksAboveAdp +
                          highestDraftPick.player.adp) %
                          highestDraftPick.draftTeamCount
                      );
                    }
                  }
                }
              }
            }

            // Sort the array based on the second element
            const sortedReachMap = Object.keys(reachMap).map((key) => [
              key,
              reachMap[key],
            ]);
            sortedReachMap.sort(
              (first, second) => second[1].length - first[1].length
            );

            const slicedReachList = sortedReachMap.slice(0, 5);
            slicedReachList.forEach(
              (keyToPicks: (string | Reach[])[], index: number) => {
                const reachList: Reach[] = keyToPicks[1] as Reach[];
                const reach: Reach = reachList[0];
                const avgPicksAboveAdp = _.mean(
                  reachList.map((r) => r.picksAboveAdp)
                );

                reach.picksAboveAdp = Math.round(avgPicksAboveAdp);
                reach.picks = reachList.map((r) => r?.picks[0]);

                if (index === 0) {
                  mostCommonReach = reach;
                }

                topFiveReaches.push(reach);
              }
            );

            // Get full list of picks for biggest/most common reaches
            biggestReach.picks =
              _.keys(reachMap).length > 0
                ? reachMap[biggestReach.picks[0]?.player_id].map(
                    (r) => r.picks[0]
                  )
                : [];

            mostCommonReach.picks =
              _.keys(reachMap).length > 0
                ? reachMap[mostCommonReach.picks[0]?.player_id].map(
                    (r) => r.picks[0]
                  )
                : [];

            const roundAnalysis: RoundAnalysis[] = [];
            roundsDraftedIn.forEach((round) => {
              const roundNumber = Number(round);
              if (roundMap[roundNumber]) {
                roundAnalysis.push(
                  getRoundAnalysis(roundNumber, roundMap[roundNumber])
                );
              }
            });

            commit('addUserInfo', {
              ...user,
              picks: allPicksFromUser,
              analysis: {
                topFiveReaches,
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
                favoriteQB,
                favoriteRB,
                favoriteWR,
                favoriteTE,
                roundAnalysis,
              },
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              draftSlot: draftSlot === 'All' ? undefined : draftSlot,
            });
          }
        } else {
          Notify.create({
            position: 'bottom',
            color: 'negative',
            message:
              'Failed to load drafts for the provided user. You probably entered an invalid user id or draft url. ',
          });
        }

        commit('removeLoadingUser', userId);
      },

      async getUserInfoFromDraft({ dispatch }, draftId: string) {
        const draftsApi = new DraftsApi();

        const draftResponse = await draftsApi.draftDraftIdGet(draftId);
        if (draftResponse.data) {
          const draft: Draft = draftResponse.data as unknown as Draft;
          for (const userId in draft.draft_order) {
            if (draft.draft_order.hasOwnProperty(userId)) {
              const draftSlot = draft.draft_order[userId];
              void dispatch('getDraftsFromUserId', {
                userId,
                season: draft.season,
                draftSlot: draftSlot,
              });
            }
          }
        }
      },
    },

    mutations: {
      addUserBeingLoaded(state, userId: string) {
        state.userInfoLoading.push(userId);
      },

      removeLoadingUser(state, userId: string) {
        const userInfoLoadingIndex = state.userInfoLoading.findIndex(
          (u) => u === userId
        );
        if (userInfoLoadingIndex != -1) {
          state.userInfoLoading.splice(userInfoLoadingIndex, 1);
        }
      },

      addUserInfo(state, userInfo: DisplayedUserInfo) {
        state.userInfo.push(userInfo);
      },

      setSeason(state, season: number) {
        state.season = season;
      },
    },

    getters: {
      displayedUserInfo: (state): DisplayedUserInfo[] => {
        return state.userInfo;
      },

      usersLoading: (state): string[] => {
        return state.userInfoLoading;
      },

      defaultSeason: (state): number => {
        return state.season;
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
