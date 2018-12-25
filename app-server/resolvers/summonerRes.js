import { SummonerSchema } from "../models";
import { API_KEY, QUEUE, SEASON } from "../lol-config";
const _ = require("lodash");
import LeagueJs from "leaguejs";
const api = new LeagueJs(API_KEY, {
  // TODO: test burst mode
  caching: {
    isEnabled: true,
    defaults: { stdTTL: 120 } // add a TTL to all Endpoints
  }
});

export default {
  Query: {
    getSummonerInfo: async (_source, _args) => {
      return await SummonerSchema.findOne({ userId: _args.userId });
    },
    getVisionScore: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(data => {
          data.summonerMatchDetails.forEach((data, index) => {
            if (data.stats.visionScore) {
              let visionScoreObject = {};
              let wardsPlacedObject = {};
              let wardsKilledObject = {};

              visionScoreObject.type = "Vision Score";
              visionScoreObject.value = Number(data.stats.visionScore);
              visionScoreObject.gameCounter = index;

              wardsPlacedObject.type = "Wards Placed";
              wardsPlacedObject.value = Number(data.stats.wardsPlaced); // kane to string number
              wardsPlacedObject.gameCounter = index;

              wardsKilledObject.type = "Wards Killed";
              wardsKilledObject.value = Number(data.stats.wardsKilled); // kane to string number
              wardsKilledObject.gameCounter = index;

              finalData.push(visionScoreObject);
              finalData.push(wardsPlacedObject);
              finalData.push(wardsKilledObject);
            }
          });
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getKDAPerGame: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(data => {
          data.summonerMatchDetails.forEach((data, index) => {
            if (data.stats.kills) {
              let tempObject = {};
              tempObject.kda =
                Math.round(
                  ((data.stats.kills + data.stats.assists) /
                    data.stats.deaths) *
                    100
                ) / 100;
              tempObject.gameCounter = index;

              finalData.push(tempObject);
            }
          });
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getAvgStats: async (_source, _args) => {
      let finalData = {};
      let allMatches = 0;
      finalData.winRatio = 0;
      finalData.goldAvg = 0;
      finalData.damageAvg = 0;
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(data => {
          data.summonerMatchDetails.forEach((data, index) => {
            if (data.stats.win) {
              finalData.winRatio++;
            }
            if (data.stats.goldEarned) {
              finalData.goldAvg += data.stats.goldEarned;
            }
            if (data.stats.totalDamageDealt) {
              finalData.damageAvg += data.stats.totalDamageDealt;
            }
            allMatches++;
          });
          finalData.winRatio = Math.floor(
            (finalData.winRatio / allMatches) * 100
          );
          finalData.goldAvg = Math.floor(finalData.goldAvg / allMatches);
          finalData.damageAvg = Math.floor(finalData.damageAvg / allMatches);
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getKillsStats: async (_source, _args) => {
      let finalData = [];
      let doubleKills = {
        killType: "Double kills",
        value: 0
      };
      let tripleKills = {
        killType: "Triple kills",
        value: 0
      };
      let quadraKills = {
        killType: "Quadra kills",
        value: 0
      };
      let pentaKills = {
        killType: "Penta kills",
        value: 0
      };
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(data => {
          data.summonerMatchDetails.forEach((data, index) => {
            if (data.stats.doubleKills) {
              doubleKills.value += data.stats.doubleKills;
              tripleKills.value += data.stats.tripleKills;
              quadraKills.value += data.stats.quadraKills;
              pentaKills.value += data.stats.pentaKills;
            }
          });
          finalData.push(doubleKills);
          finalData.push(tripleKills);
          finalData.push(quadraKills);
          finalData.push(pentaKills);
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getDamageDealtToChampions: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(data => {
          data.summonerMatchDetails.forEach((data, index) => {
            if (data.stats.magicDamageDealtToChampions) {
              let totalDamage = {};
              let magicDamage = {};
              let physicalDamage = {};
              let trueDamage = {};

              totalDamage.type = "Total Damage";
              totalDamage.value = Number(
                data.stats.totalDamageDealtToChampions
              );
              totalDamage.gameCounter = index;

              magicDamage.type = "Magic Damage";
              magicDamage.value = Number(
                data.stats.magicDamageDealtToChampions
              ); // kane to string number
              magicDamage.gameCounter = index;

              physicalDamage.type = "Physical Damage";
              physicalDamage.value = Number(
                data.stats.physicalDamageDealtToChampions
              ); // kane to string number
              physicalDamage.gameCounter = index;

              trueDamage.type = "True Damage";
              trueDamage.value = Number(data.stats.trueDamageDealtToChampions); // kane to string number
              trueDamage.gameCounter = index;

              finalData.push(totalDamage);
              finalData.push(magicDamage);
              finalData.push(physicalDamage);
              finalData.push(trueDamage);
            }
          });
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getCreepsPerMinDeltas: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(user => {
          user.summonerMatchDetails.forEach((data, index) => {
            if (data.timeline.creepsPerMinDeltas) {
              Object.entries(data.timeline.creepsPerMinDeltas)
                .sort()
                .forEach((d, i) => {
                  let creepsPerMinDeltas = {};
                  if (d[0].startsWith("0")) {
                    creepsPerMinDeltas.type = "0-10";
                  } else if (d[0].startsWith("10")) {
                    creepsPerMinDeltas.type = "10-20";
                  } else if (d[0].startsWith("20")) {
                    creepsPerMinDeltas.type = "20-30";
                  } else if (d[0].startsWith("30")) {
                    creepsPerMinDeltas.type = "30-40";
                  }

                  creepsPerMinDeltas.value = Number(d[1]);
                  creepsPerMinDeltas.gameCounter = index;
                  finalData.push(creepsPerMinDeltas);
                });
            }
          });
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getXpPerMinDeltas: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(user => {
          user.summonerMatchDetails.forEach((data, index) => {
            if (data.timeline.xpPerMinDeltas) {
              Object.entries(data.timeline.xpPerMinDeltas)
                .sort()
                .forEach((d, i) => {
                  let xpPerMinDeltas = {};
                  if (d[0].startsWith("0")) {
                    xpPerMinDeltas.type = "0-10";
                  } else if (d[0].startsWith("10")) {
                    xpPerMinDeltas.type = "10-20";
                  } else if (d[0].startsWith("20")) {
                    xpPerMinDeltas.type = "20-30";
                  } else if (d[0].startsWith("30")) {
                    xpPerMinDeltas.type = "30-40";
                  }

                  xpPerMinDeltas.value = Number(d[1]);
                  xpPerMinDeltas.gameCounter = index;
                  finalData.push(xpPerMinDeltas);
                });
            }
          });
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getGoldPerMinDeltas: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(user => {
          user.summonerMatchDetails.forEach((data, index) => {
            if (data.timeline.goldPerMinDeltas) {
              Object.entries(data.timeline.goldPerMinDeltas)
                .sort()
                .forEach((d, i) => {
                  let goldPerMinDeltas = {};
                  if (d[0].startsWith("0")) {
                    goldPerMinDeltas.type = "0-10";
                  } else if (d[0].startsWith("10")) {
                    goldPerMinDeltas.type = "10-20";
                  } else if (d[0].startsWith("20")) {
                    goldPerMinDeltas.type = "20-30";
                  } else if (d[0].startsWith("30")) {
                    goldPerMinDeltas.type = "30-40";
                  }

                  goldPerMinDeltas.value = Number(d[1]);
                  goldPerMinDeltas.gameCounter = index;
                  finalData.push(goldPerMinDeltas);
                });
            }
          });
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    }
  },
  Mutation: {
    // TODO: check start, end and totalgames index
    updateSummonerInfo: (_source, _args) => {
      SummonerSchema.findOne(
        { "summonerInfo.name": _args.summonerName },
        (err, result) => {
          let matchDetails = [];
          api.Match.gettingListByAccount(
            result.summonerInfo.accountId,
            _args.server,
            { queue: [QUEUE], season: [SEASON], beginIndex: result.endIndex }
          )
            .then(matchList => {
              return matchList;
            })
            .then(matchesList => {
              Promise.all(
                matchesList.matches.map(async function(match) {
                  await api.Match.gettingById(match.gameId, _args.server)
                    .then(data => {
                      // Pernw to participantid tou summoner
                      let summonerID = data.participantIdentities.filter(
                        function(summoner) {
                          return (
                            summoner.player.summonerName === _args.summonerName
                          );
                        }
                      );

                      let temp = data.participants.filter(function(summoner) {
                        return (
                          summoner.participantId === summonerID[0].participantId
                        );
                      });
                      matchDetails.push(temp[0]);
                    })
                    .catch(err => {
                      console.error(
                        ">>> setSummonerInfo resolver: Match Endpoint Error (details)" +
                          err
                      );
                    });
                })
              ).then(() => {
                SummonerSchema.updateOne(
                  { _id: result._id },
                  {
                    $push: { summonerMatchDetails: matchDetails },
                    $inc: { endIndex: 100 },
                    totalGames: matchesList.totalGames
                  },
                  { safe: true, upsert: true },
                  function(err, model) {
                    if (err)
                      console.error(
                        ">>> setSummonerInfo resolver: Update Error"
                      );
                    console.log("💪 Summoner updated");
                  }
                );
              });
            });
        }
      );
    }
  }
};
