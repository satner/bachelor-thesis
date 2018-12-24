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
            let tempObject = {};
            tempObject.kda =
              Math.round(
                ((data.stats.kills + data.stats.assists) / data.stats.deaths) *
                  100
              ) / 100;
            tempObject.gameCounter = index;

            finalData.push(tempObject);
          });
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    },
    getWinRatio: async (_source, _args) => {
      let finalData = 0;
      let allMatches = 0;
      await SummonerSchema.findOne({ userId: _args.userId })
        .exec()
        .then(data => {
          data.summonerMatchDetails.forEach((data, index) => {
            if (data.stats.win) {
              finalData++;
            }
            allMatches++;
          });
          finalData = Math.floor((finalData / allMatches) * 100);
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
            doubleKills.value += data.stats.doubleKills;
            tripleKills.value += data.stats.tripleKills;
            quadraKills.value += data.stats.quadraKills;
            pentaKills.value += data.stats.pentaKills;
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
            let totalDamage = {};
            let magicDamage = {};
            let physicalDamage = {};
            let trueDamage = {};

            totalDamage.type = "Total Damage";
            totalDamage.value = Number(data.stats.totalDamageDealtToChampions);
            totalDamage.gameCounter = index;

            magicDamage.type = "Magic Damage";
            magicDamage.value = Number(data.stats.magicDamageDealtToChampions); // kane to string number
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
