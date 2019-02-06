import moment from "moment";
import { SummonerSchema, UserSchema } from "../models";
import { API_KEY, QUEUE, SEASON } from "../lol-config";
const _ = require("lodash");
import LeagueJs from "leaguejs";

const api = new LeagueJs(API_KEY, {
  useV4: true,
  PLATFORM_ID: "eun1"
});

export default {
  Query: {
    getSummonerInfo: async (_source, _args) => {
      return await SummonerSchema.findOne({ userId: _args.userId });
    },
    getVisionScore: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
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
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
        .exec()
        .then(data => {
          data.summonerMatchDetails.forEach((data, index) => {
            if (data.stats.kills) {
              let tempObject = {};
              if (data.stats.deaths !== 0) {
                tempObject.kda = Math.floor(
                  (data.stats.kills + data.stats.assists) / data.stats.deaths
                );
              } else {
                tempObject.kda = Math.floor(
                  (data.stats.kills + data.stats.assists) / 1
                );
              }

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
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
        .exec()
        .then(data => {
          finalData.winRatio = data.summonerLeagueInfo.winRatio;
          finalData.goldAvg = data.summonerLeagueInfo.avgGold;
          finalData.damageAvg = data.summonerLeagueInfo.avgDamage;
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
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
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
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
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
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
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
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
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
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
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
    },
    getCalendarStats: async (_source, _args) => {
      let finalData = {};
      let finalTimeStamps = [];
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
        .exec()
        .then(data => {
          finalTimeStamps = data.matchesTimeline;
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      // Calculate min and max date
      let momentDays = finalTimeStamps.map(d => moment(d.day));
      finalData.maxDay = moment.max(momentDays).format("YYYY-MM-DD");
      finalData.minDay = moment.min(momentDays).format("YYYY-MM-DD");
      finalData.timeline = finalTimeStamps;

      return finalData;
    },
    getRadarStats: async (_source, _args) => {
      let finalData = [];
      let allMatches = 0;
      let mapControl = { type: "Map Control", value: 0 };
      let goldAggregate = { type: "Gold Aggregate", value: 0 };
      let damageAggregate = { type: "Damage Aggregate", value: 0 };
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
        .exec()
        .then(user => {
          user.summonerMatchDetails.forEach((data, index) => {
            if (data) {
              mapControl.value +=
                data.stats.wardsPlaced +
                data.stats.wardsKilled +
                data.stats.damageDealtToObjectives +
                data.stats.damageDealtToTurrets;
              if (data.stats.firstTowerKill) {
                mapControl.value++;
                goldAggregate.value++;
              }
              goldAggregate.value +=
                data.stats.goldEarned +
                data.stats.totalMinionsKilled +
                data.stats.visionScore;
              if (data.stats.firstBloodKill) {
                goldAggregate.value++;
              }

              if (data.stats.firstTowerKill) {
                goldAggregate.value++;
              }
              if (data.stats.firstInhibitorAssist) {
                goldAggregate.value++;
              }
              damageAggregate.value += data.stats.totalDamageDealtToChampions;
              //damageAggregate.value -= data.stats.totalDamageTaken;

              allMatches++;
            }
          });
          mapControl.value = Math.floor(mapControl.value / allMatches);
          goldAggregate.value = Math.floor(goldAggregate.value / allMatches);
          damageAggregate.value = Math.floor(
            damageAggregate.value / allMatches
          );

          finalData.push(mapControl);
          finalData.push(goldAggregate);
          finalData.push(damageAggregate);
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });

      return finalData;
    },
    getFiveMostPlayedChampions: async (_source, _args) => {
      let finalData = [];
      await SummonerSchema.findOne({
        userId: _args.userId,
        "summonerInfo.name": _args.summonerName,
        "summonerInfo.server": _args.server
      })
        .exec()
        .then(data => {
          finalData = data.summonerLeagueInfo.mostPlayedChampions;
        })
        .catch(err => {
          console.error("❌ Searching summoner data error", err);
        });
      return finalData;
    }
  },
  Mutation: {
    updateSummonerInfo: (_source, _args) => {
      let newEndIndex = 0;
      let newTimeStamps = [];
      let newFinalTimeStamps = [];
      let newTier = "";
      let newWinRatio = 0;
      let newAvgGold = 0;
      let newAvgDamage = 0;
      let newChampionsCount = [];
      let newProfileIconId = 0;
      SummonerSchema.findOne(
        {
          "summonerInfo.name": _args.summonerName,
          "summonerInfo.server": _args.server
        },
        (err, result) => {
          let matchDetails = [];
          api.League.gettingPositionsForSummonerId(
            result.summonerInfo.id,
            _args.server
          ).then(d => {
            if (d[0].queueType.includes("SOLO")) {
              newTier = d[0].tier;
              // calculate new win ratio
              newWinRatio = Math.floor(
                (d[0].wins / (d[0].wins + d[0].losses)) * 100
              );
            } else {
              newTier = d[1].tier;
              // calculate new win ratio
              newWinRatio = Math.floor(
                (d[1].wins / (d[1].wins + d[1].losses)) * 100
              );
            }
          });

          api.Match.gettingListByAccount(
            result.summonerInfo.accountId,
            _args.server,
            { queue: [QUEUE], season: [SEASON], beginIndex: result.endIndex }
          )
            .then(matchList => {
              // Convert each timestamp to normal data
              matchList.matches.forEach(data => {
                let temp = {};
                temp.day = moment(data.timestamp).format("YYYY-MM-DD");
                temp.value = 1;
                newTimeStamps.push(temp);
              });
              newFinalTimeStamps = _(newTimeStamps)
                .groupBy("day")
                .map((objs, key) => ({
                  day: key,
                  value: _.sumBy(objs, "value")
                }))
                .value();

              // Calculate new end index
              newEndIndex = result.endIndex + matchList.matches.length;
              return matchList;
            })
            .then(matchesList => {
              Promise.all(
                matchesList.matches.map(async function(match, index) {
                  await api.Match.gettingById(match.gameId, _args.server)
                    .then(async data => {
                      // Pernw to participantid tou summoner
                      let summonerID = data.participantIdentities.filter(
                        function(summoner) {
                          return (
                            summoner.player.summonerName === _args.summonerName
                          );
                        }
                      );

                      let myUserData = data.participants.filter(function(
                        summoner
                      ) {
                        return (
                          summoner.participantId === summonerID[0].participantId
                        );
                      });

                      // Calculate average GOLD and DAMAGE
                      if (myUserData[0].stats.goldEarned) {
                        newAvgGold += myUserData[0].stats.goldEarned;
                      }
                      if (myUserData[0].stats.totalDamageDealt) {
                        newAvgDamage += myUserData[0].stats.totalDamageDealt;
                      }
                      if (matchesList.matches.length - 1 === index) {
                        newAvgGold = Math.floor(
                          newAvgGold / matchesList.matches.length
                        );
                        newAvgDamage = Math.floor(
                          newAvgDamage / matchesList.matches.length
                        );
                      }

                      // Calculate 5 most played champions
                      let temp = { value: 1 };
                      temp.championId = myUserData[0].championId;
                      if (myUserData[0].stats.win) {
                        temp.wins = 1;
                      } else {
                        temp.losses = 1;
                      }

                      newChampionsCount.push(temp);

                      if (matchesList.matches.length - 1 === index) {
                        // Poses fores exei pexei auto to champion
                        newChampionsCount = _(newChampionsCount)
                          .groupBy("championId")
                          .map((objs, key) => ({
                            championId: key,
                            wins: _.sumBy(objs, "wins") || 0,
                            losses: _.sumBy(objs, "losses") || 0
                          }))
                          .value();

                        // Ipologismos ton total games me kathe champion
                        newChampionsCount.forEach(data => {
                          data.championTotalGames = data.wins + data.losses;
                        });

                        // Sort tou array final data
                        let results = _.orderBy(
                          newChampionsCount,
                          ["championTotalGames"],
                          ["desc"]
                        );

                        // Check gia null or undefined values
                        newChampionsCount = newChampionsCount.filter(data => {
                          return data.name;
                        });

                        // Store mono ton pente champion me ta perisotera games
                        newChampionsCount = results.splice(0, 5);
                      }

                      matchDetails.push(myUserData[0]);
                    })
                    .catch(err => {
                      console.error(
                        ">>> updateSummonerInfo resolver: Match Endpoint Error (details)" +
                          err
                      );
                    });
                })
              ).then(async () => {
                // Take old value of avg stats
                await SummonerSchema.findById(result._id)
                  .exec()
                  .then(data => {
                    newAvgGold = Math.floor(
                      (data.summonerLeagueInfo.avgGold + newAvgGold) / 2
                    );
                    newAvgDamage = Math.floor(
                      (data.summonerLeagueInfo.avgDamage + newAvgDamage) / 2
                    );
                  })
                  .catch(err => {
                    console.error(">>> updateSummonerInfo resolver " + err);
                  });
                // Take old value of matchesTimeline and do stuff
                await SummonerSchema.findById(result._id)
                  .exec()
                  .then(data => {
                    newFinalTimeStamps = _.concat(
                      data.matchesTimeline,
                      newFinalTimeStamps
                    );
                    newFinalTimeStamps = _(newFinalTimeStamps)
                      .groupBy("day")
                      .map((objs, key) => ({
                        day: key,
                        value: _.sumBy(objs, "value")
                      }))
                      .value();
                  })
                  .catch(err => {
                    console.error(">>> updateSummonerInfo resolver " + err);
                  });

                // Take old value of most played champions
                await SummonerSchema.findById(result._id)
                  .exec()
                  .then(async data => {
                    newChampionsCount = _.concat(
                      data.summonerLeagueInfo.mostPlayedChampions,
                      newChampionsCount
                    );
                    newChampionsCount = _(newChampionsCount)
                      .groupBy("championId")
                      .map((objs, key) => ({
                        championId: key,
                        wins: _.sumBy(objs, "wins") || 0,
                        losses: _.sumBy(objs, "losses") || 0
                      }))
                      .value();
                    // Getting champion name from champion id
                    let championsNamePromises = newChampionsCount.map(
                      async d => {
                        await api.StaticData.gettingChampionById(d.championId)
                          .then(res => {
                            d.name = res.name;
                            d.winsColor = "hsl(88, 70%, 50%)";
                            d.lossesColor = "hsl(352, 70%, 50%)";
                          })
                          .catch(err => {
                            console.error(
                              "TAKING CHAMPION NAME BACK ERRR",
                              err
                            );
                          });
                      }
                    );
                    await Promise.all(championsNamePromises);
                    // Ipologismos ton total games me kathe champion
                    newChampionsCount.forEach(data => {
                      data.championTotalGames = data.wins + data.losses;
                    });
                    // Sort tou array final data
                    let results = _.orderBy(
                      newChampionsCount,
                      ["championTotalGames"],
                      ["desc"]
                    );

                    // Store mono ton pente champion me ta perisotera games
                    newChampionsCount = results.splice(0, 5);
                  })
                  .catch(err => {
                    console.error(">>> updateSummonerInfo resolver " + err);
                  });

                // Update profile icon id
                await api.Summoner.gettingByName(
                  _args.summonerName,
                  _args.server
                )
                  .then(data => {
                    newProfileIconId = data.profileIconId;
                  })
                  .catch(err => {
                    console.error(">>> updateSummonerInfo resolver 22" + err);
                  });
                SummonerSchema.updateOne(
                  { _id: result._id },
                  {
                    $push: {
                      summonerMatchDetails: matchDetails
                    },
                    "summonerInfo.profileIconId": newProfileIconId,
                    "summonerLeagueInfo.mostPlayedChampions": newChampionsCount,
                    matchesTimeline: newFinalTimeStamps,
                    endIndex: newEndIndex,
                    totalGames: matchesList.totalGames,
                    "summonerLeagueInfo.tier": newTier,
                    "summonerLeagueInfo.winRatio": newWinRatio,
                    "summonerLeagueInfo.avgGold": newAvgGold,
                    "summonerLeagueInfo.avgDamage": newAvgDamage
                  },
                  { safe: true, upsert: true },
                  function(err, model) {
                    if (err) {
                      console.error(
                        ">>> updateSummonerInfo resolver: Update Error",
                        err
                      );
                    } else {
                      console.log("💪 Summoner updated");
                    }
                  }
                );
                UserSchema.updateOne(
                  {
                    summoner: {
                      $elemMatch: {
                        name: _args.summonerName,
                        server: _args.server
                      }
                    }
                  },
                  {
                    $set: {
                      "summoner.$.tier": newTier,
                      "summoner.$.winRatio": newWinRatio
                    },
                    "summoner.$.avgGold": newAvgGold,
                    "summoner.$.avgDamage": newAvgDamage,
                    "summoner.$.mostPlayedChampions": newChampionsCount,
                    "summoner.$.profileIconId": newProfileIconId
                  },
                  (err, data) => {
                    if (err) {
                      console.error("❌ Updating Summoner error", err);
                    } else {
                      console.log("💪 Summoner updated");
                    }
                  }
                );
              });
            });
        }
      );
    }
  }
};
