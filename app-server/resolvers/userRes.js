import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import moment from "moment";
const _ = require("lodash");
import { SummonerSchema, UserSchema } from "../models";
import { API_KEY, QUEUE, SEASON } from "../lol-config";
import { EMAIL, PASSWORD } from "../mail-settings";
import LeagueJs from "leaguejs";
import forgotPasswordEmailHTML from "../forgotPasswordEmailHTML";
import forgotPasswordEmailTXT from "../forgotPasswordEmailTXT";

const api = new LeagueJs(API_KEY, {
  useV4: true,
  PLATFORM_ID: "eun1"
});

// oi tris katw lines gia na epistrefei to id pou einai tipou _bsontype
const ObjectId = require("mongoose").Types.ObjectId;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};

const JWT_KEY = "kappa";

export default {
  Query: {
    getUserInfos: async (_source, _args) => {
      return await UserSchema.findOne({ _id: _args.id }, (err, user) => {
        if (err) console.error("❌ Getting user info error!");
        return user;
      });
    },
    getPaginationUsers: async (_source, _args) => {
      let query = {};
      let finalData = {};
      let summonerValues = {};

      if (_args.server) {
        summonerValues.server = _args.server;
        query.summoner = summonerValues;
      }

      if (_args.tier) {
        summonerValues.tier = _args.tier;
        query.summoner = summonerValues;
      }

      if (_args.roles) {
        if (_args.roles.length > 0) {
          query.roles = { $in: _args.roles };
        }
      }

      if (_args.languages) {
        if (_args.languages.length > 0) {
          query.languages = { $in: _args.languages };
        }
      }

      if (_args.winRatio) {
        summonerValues.winRatio = { $gte: _args.winRatio };
        query.summoner = summonerValues;
      }

      if (_args.avgGold) {
        summonerValues.avgGold = { $gte: _args.avgGold };
        query.summoner = summonerValues;
      }

      if (_args.avgDamage) {
        summonerValues.avgDamage = { $gte: _args.avgDamage };
        query.summoner = summonerValues;
      }

      if (_args.champions) {
        if (_args.champions.length > 0) {
          summonerValues.mostPlayedChampions = {
            $elemMatch: { name: { $in: _args.champions } }
          };
          query.summoner = summonerValues;
        }
      }

      if (Object.keys(summonerValues).length !== 0) {
        query.summoner = { $elemMatch: summonerValues };
      } else {
        query.summoner = { $exists: true, $ne: [] }; // Gia na apokliso  tous user pou den expun dilwsei akoma accounts
      }

      let latestPatchNumber = "8.24.1"; // Default value
      await api.StaticData.gettingVersions().then(data => {
        latestPatchNumber = data[0];
      });

      /*
       * Επιστροφή των αποτελεσμάτων αναζήτησης αγνοόντας
       * (skip(_args.skip)) κάποια και περιορίζοντας σε
       * ένα μέγιστο πλήθος
       * */
      await UserSchema.find(query)
        .skip(_args.skip)
        .limit(_args.limit)
        .exec()
        .then(data => {
          finalData = data;
          data.forEach((d, index) => {
            finalData[index].latestPatchNumber = latestPatchNumber;
          });
        })
        .catch(err => {
          console.error("❌ Get pagination users!" + err);
        });

      return finalData;
    },
    getPaginationNumber: async (_source, _args) => {
      let query = {};
      let summonerValues = {};

      if (_args.server) {
        summonerValues.server = _args.server;
        query.summoner = summonerValues;
      }

      if (_args.tier) {
        summonerValues.tier = _args.tier;
        query.summoner = summonerValues;
      }

      if (_args.roles) {
        if (_args.roles.length > 0) {
          query.roles = { $in: _args.roles };
        }
      }

      if (_args.languages) {
        if (_args.languages.length > 0) {
          query.languages = { $in: _args.languages };
        }
      }

      if (_args.winRatio) {
        summonerValues.winRatio = { $gte: _args.winRatio };
        query.summoner = summonerValues;
      }

      if (_args.avgGold) {
        summonerValues.avgGold = { $gte: _args.avgGold };
        query.summoner = summonerValues;
      }

      if (_args.avgDamage) {
        summonerValues.avgDamage = { $gte: _args.avgDamage };
        query.summoner = summonerValues;
      }

      if (_args.champions) {
        if (_args.champions.length > 0) {
          summonerValues.mostPlayedChampions = {
            $elemMatch: { name: { $in: _args.champions } }
          };
          query.summoner = summonerValues;
        }
      }

      if (Object.keys(summonerValues).length !== 0) {
        query.summoner = { $elemMatch: summonerValues };
      } else {
        query.summoner = { $exists: true, $ne: [] }; // Gia na apokliso  tous user pou den expun dilwsei akoma accounts
      }

      return await UserSchema.countDocuments(query)
        .exec()
        .then()
        .catch(err => {
          console.error("❌ Get pagination number!" + err);
        });
    }
  },
  Mutation: {
    addSummoner: async (_source, _args) => {
      let done = false;
      let newSummoner = {};
      newSummoner.server = _args.server;
      let matchDetails = [];
      let finalData = {};
      let timeStamps = [];
      let finalTimeStamps = [];
      let avgGold = 0;
      let avgDamage = 0;
      let win = 0;
      let loss = 0;
      let championsCount = [];
      // Αναζήτηση στην βάση δεδομένων εάν το όνομα υπάρχει ήδη
      await SummonerSchema.findOne({
        "summonerInfo.name": _args.summoner,
        "summonerInfo.server": _args.server
      })
        .exec()
        .then(async user => {
          if (user) {
            console.error("❌ Summoner name already exists in the database!");
          } else {
            console.log(
              "🤷 Summoner name IS NOT already in the database!\n🏁 Start searching in the LOL-API"
            );
            // Αίτηση στην υπηρεσία /summoners/by-name
            await api.Summoner.gettingByName(_args.summoner, _args.server)
              .then(data => {
                done = true;
                console.log("🤷 Summoner name found");
                finalData.summonerInfo = data;
              })
              .catch(err => {
                console.log("❌ Summoner name IS NOT in lol-API", err);
              });
          }
        })
        .catch(err => {
          console.error("❌ Add user error: search error", err);
        });

      if (done) {
        // Ean o xristis den einai sto DB and IPARXEI sto lol-API MPES edw
        // Αίτηση στην υπηρεσία /positions/by-summoner
        let summonerNameApiPromise = api.League.gettingPositionsForSummonerId(
          finalData.summonerInfo.id,
          _args.server
        )
          .then(data => {
            if (data.length > 0) {
              /*
               * Αποθήκευση των δεδομένων που αφορούν μόνο τον τρόπο
               * παιχνιδιού solo queue
               * */
              if (data[0].queueType.includes("SOLO")) {
                finalData.summonerLeagueInfo = data[0];
              } else {
                finalData.summonerLeagueInfo = data[1];
              }
            } else {
              finalData.summonerLeagueInfo = {};
            }
            /*
             * Αίτηση στην υπηρεσία /matchlists/by-account με τα
             * ορίσματα server, queue, season
             * */
            return api.Match.gettingListByAccount(
              finalData.summonerInfo.accountId,
              _args.server,
              {
                queue: [QUEUE],
                season: [SEASON]
              }
            );
          })
          .catch(err => {
            console.error(
              "❌ >>> setSummonerInfo resolver: League Endpoint Error: " + err
            );
          })
          .then(matchList => {
            if (matchList) {
              finalData.startIndex = matchList.startIndex;
              finalData.endIndex = matchList.endIndex;
              finalData.totalGames = matchList.totalGames;

              // Μετατροπή κάθε χρονοσφραγίδας σε κανονική ημερομηνία
              matchList.matches.forEach(data => {
                let temp = {};
                temp.day = moment(data.timestamp).format("YYYY-MM-DD");
                temp.value = 1;
                timeStamps.push(temp);
              });
              finalTimeStamps = _(timeStamps)
                .groupBy("day")
                .map((objs, key) => ({
                  day: key,
                  value: _.sumBy(objs, "value")
                }))
                .value();

              // Επιστροφή της λίστας των αγώνων
              return matchList.matches;
            } else {
              done = false;
            }
          })
          .catch(err => {
            console.error(
              "❌ >>> setSummonerInfo resolver: Match Endpoint Error: " + err
            );
          });

        await summonerNameApiPromise
          .then(matchList => {
            if (matchList) {
              Promise.all(
                /*
                 * Αίτηση στην υπηρεσία /matches με όρισμα το gameId
                 * Το πλήθος των αιτήσεων είναι ίσο με μέγεθος της λίστας που
                 * επιστρέφεται από την αίτηση στην υπηρεσία /matchlists/by-account
                 * */
                matchList.map(async function(match, index) {
                  await api.Match.gettingById(match.gameId, _args.server)
                    .then(async data => {
                      // Εύρεση του participantid για το όνομα του παίκτη
                      // της αρχικής αναζήτησης
                      let summonerID = data.participantIdentities.filter(
                        function(summoner) {
                          return (
                            //  finalData.summonerInfo.name giati apo to api kanoun ignore to word case
                            summoner.player.summonerName ===
                            finalData.summonerInfo.name
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
                        avgGold += myUserData[0].stats.goldEarned;
                      }
                      if (myUserData[0].stats.totalDamageDealt) {
                        avgDamage += myUserData[0].stats.totalDamageDealt;
                      }
                      if (matchList.length - 1 === index) {
                        avgGold = Math.floor(avgGold / matchList.length);
                        avgDamage = Math.floor(avgDamage / matchList.length);
                      }

                      // Store wins and losses
                      if (myUserData[0].stats.win) {
                        win++;
                      } else {
                        loss++;
                      }

                      // Calculate 5 most played champions
                      let temp = { value: 1 };
                      temp.championId = myUserData[0].championId;
                      if (myUserData[0].stats.win) {
                        temp.wins = 1;
                      } else {
                        temp.losses = 1;
                      }
                      championsCount.push(temp);

                      if (matchList.length - 1 === index) {
                        // Poses fores exei pexei auto to champion
                        championsCount = _(championsCount)
                          .groupBy("championId")
                          .map((objs, key) => ({
                            championId: key,
                            wins: _.sumBy(objs, "wins") || 0,
                            losses: _.sumBy(objs, "losses") || 0
                          }))
                          .value();

                        // Getting champion name from champion id
                        let championsNamePromises = championsCount.map(
                          async d => {
                            await api.StaticData.gettingChampionById(
                              d.championId
                            )
                              .then(res => {
                                d.name = res.name;
                                d.winsColor = "hsl(88, 70%, 50%)";
                                d.lossesColor = "hsl(352, 70%, 50%)";
                              })
                              .catch(err => {
                                console.error(
                                  "Getting champion names error",
                                  err
                                );
                              });
                          }
                        );
                        await Promise.all(championsNamePromises);

                        // Ipologismos ton total games me kathe champion
                        championsCount.forEach(data => {
                          data.championTotalGames = data.wins + data.losses;
                        });

                        // Sort tou array final data
                        let results = _.orderBy(
                          championsCount,
                          ["championTotalGames"],
                          ["desc"]
                        );

                        // Check gia null or undefined values
                        championsCount = championsCount.filter(data => {
                          return data.name;
                        });

                        // Store mono ton pente champion me ta perisotera games
                        championsCount = results.splice(0, 5);
                      }

                      matchDetails.push(myUserData[0]);
                    })
                    .catch(err => {
                      console.error(
                        ">>> addSummoner resolver: Match Endpoint Error (details)" +
                          err
                      );
                    });
                })
              ).then(async () => {
                // Store average GOLD and DAMAGE
                newSummoner.avgGold = avgGold;
                newSummoner.avgDamage = avgDamage;
                finalData.summonerLeagueInfo.avgGold = avgGold;
                finalData.summonerLeagueInfo.avgDamage = avgDamage;

                // store win ratio to user Schema
                newSummoner.winRatio = Math.floor((win / (win + loss)) * 100);
                // Store win ratio to summoner Schema
                finalData.summonerLeagueInfo.winRatio = newSummoner.winRatio;

                // Store 5 most played champions
                newSummoner.mostPlayedChampions = championsCount;
                finalData.summonerLeagueInfo.mostPlayedChampions = championsCount;

                finalData.summonerMatchDetails = matchDetails;
                finalData.userId = _args.id;
                finalData.summonerInfo.server = _args.server;
                finalData.matchesTimeline = finalTimeStamps;
                SummonerSchema.create(finalData);
                newSummoner.name = finalData.summonerInfo.name;
                newSummoner.tier = finalData.summonerLeagueInfo.tier;
                newSummoner.profileIconId =
                  finalData.summonerInfo.profileIconId;
                newSummoner.summonerLevel =
                  finalData.summonerInfo.summonerLevel;

                await UserSchema.findOneAndUpdate(
                  { _id: _args.id },
                  { $push: { summoner: newSummoner } }
                )
                  .exec()
                  .then(d => {
                    console.log("Summoner added!");
                    done = true;
                  })
                  .catch(e => {
                    console.error("Add summoner error!", e);
                  });
                console.log("💾 Summoner saved!");
              });
            } else {
              done = false;
            }
          })
          .catch(err => {
            done = false;
          });
        console.log("RET 1", done);
        return done;
      } else {
        // Den ipaxei EGIRO summoner-name H iparxei idi sto DB
        console.error("❌ Summoner name does NOT exist TOTAL!");
      }
    },
    deleteSummoner: async (_source, _args) => {
      let done = false;
      await UserSchema.findByIdAndUpdate(_args.id, {
        $pull: { summoner: { name: _args.summoner, server: _args.server } }
      })
        .exec()
        .then(d => {
          if (d) {
            console.log("🗑 Summoner Deleted! -- UserSchema");
            done = true;
          } else {
            console.error("❌ Summoner has not deleted! -- UserSchema");
            done = false;
          }
        })
        .catch(e => {
          console.error("❌ Summoner has not deleted! -- UserSchema", e);
          done = false;
        });
      await SummonerSchema.findOneAndDelete({
        userId: _args.id,
        "summonerInfo.name": _args.summoner,
        "summonerInfo.server": _args.server
      })
        .exec()
        .then(d => {
          if (d) {
            console.log("🗑 Summoner Deleted! -- SummonerSchema");
            done = true;
          } else {
            console.error("❌ Summoner has not deleted! -- SummonerSchema");
            done = false;
          }
        })
        .catch(e => {
          console.error("❌ Summoner has not deleted! -- SummonerSchema", e);
          done = false;
        });
      return done;
    },
    login: async (_source, _args) => {
      let token;
      await UserSchema.findOne({ email: _args.email })
        .exec()
        .then(async user => {
          /*
           * Σύγκριση του κωδικού της φόρμας με αυτόν της βάσης δεδομένων
           * και δημιουργία του token διάρκειας μιας ώρας
           * */
          await bcrypt.compare(_args.password, user.password).then(res => {
            if (res) {
              token = jwt.sign(
                {
                  id: user._id,
                  email: user.email,
                  languages: user.languages,
                  roles: user.roles
                },
                JWT_KEY,
                {
                  expiresIn: "1h"
                }
              );
            } else {
              console.error("❌ Password invalid");
            }
          });
        })
        .catch(err => {
          console.error("❌ Password invalid", err);
        });
      return token;
    },
    signup: async (_source, _args) => {
      let done = false;
      await UserSchema.find({ email: _args.email })
        .exec()
        .then(async user => {
          if (user.length === 1) {
            console.log("User already exists!");
          } else {
            done = true;
            // Κωδικοποίηση του κωδικού με την βιβλιοθήκη bcrypt
            await bcrypt
              .hash(_args.password, 10)
              .then(hash => {
                const user = new UserSchema({
                  email: _args.email,
                  password: hash,
                  languages: _args.languages,
                  roles: _args.roles
                });
                user
                  .save()
                  .then(result => {
                    console.log("User created!");
                  })
                  .catch(err => {
                    console.error("❌ User has not created!");
                  });
              })
              .catch(err => {
                console.error("❌ User create error", err);
              });
          }
        })
        .catch(err => {
          console.error("❌ User create error", err);
        });
      return done;
    },
    forgotPassword: async (_source, _args) => {
      let done = false;
      let token = "";

      await UserSchema.findOneAndUpdate({ email: _args.email })
        .exec()
        .then(user => {
          if (user) {
            console.log("User exists!");
            done = true;
          }
        })
        .catch(err => {
          console.error("❌ Forgot Password", err);
        })
        .then(() => {
          token = jwt.sign(
            {
              email: _args.email
            },
            JWT_KEY,
            {
              expiresIn: "5m"
            }
          );
        })
        .then(async () => {
          /*
           * Αποθήκευση του token στο κατάλληλο έγγραφο, δηλαδή στο έγγραφο
           * που αντιστοιχεί στον χρήστη που έκανε την αίτηση της
           * αλλαγής/ανάκτησης του κωδικού πρόσβασης
           * */
          await UserSchema.findOneAndUpdate(
            { email: _args.email },
            { resetPasswordToken: token }
          )
            .exec()
            .then(user => {
              if (user) {
                // Έναρξη των διαδικασιών για την αποστολή του e-mail
                let transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: EMAIL,
                    pass: PASSWORD
                  },
                  tls: {
                    rejectUnauthorized: false
                  }
                });

                let mailOptions = {
                  from: `"TeamMate Stats 👻" ${EMAIL}`,
                  to: _args.email,
                  subject: "Reset Password",
                  text: forgotPasswordEmailTXT(token),
                  html: forgotPasswordEmailHTML(token)
                };

                // Αποστολή του e-mail
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    return console.log(error);
                  }
                  console.log("Message sent: %s", info.messageId);
                });
                done = true;
              }
            });
        });
      return done;
    },
    resetPassword: async (_source, _args) => {
      let done = false;
      await UserSchema.findOne({ resetPasswordToken: _args.token })
        .exec()
        .then(async user => {
          if (user) {
            let { exp } = jwt.decode(_args.token);
            done = exp >= new Date().getTime() / 1000;
            if (done) {
              await bcrypt
                .hash(_args.password, 10)
                .then(async hash => {
                  await UserSchema.findOneAndUpdate(
                    { resetPasswordToken: _args.token },
                    { password: hash }
                  )
                    .exec()
                    .then(user => {
                      if (user) {
                        console.log("Reset user password complete");
                        done = true;
                      }
                    })
                    .catch(err => {
                      console.error("❌ Reset user error", err);
                    });
                })
                .catch(err => {
                  console.error("❌ Reset user error", err);
                });
            }
          }
        })
        .catch(err => {
          console.error("❌ Updating user password", err);
        });
      return done;
    },
    updateUserInfo: async (_source, _args) => {
      let done = false;

      if (_args.email !== "") {
        // Check if email already exists!
        await UserSchema.findOne({ email: _args.email })
          .exec()
          .then(user => {
            if (user) {
              if (ObjectId(user._id).toString() !== _args.id) {
                console.log("Email already exists!");
                done = false;
              } else {
                done = true;
              }
            } else {
              done = true;
            }
          })
          .catch(err => {
            console.error("❌ Updating user error", err);
          });
      }

      if (done) {
        if (_args.password === "" && _args.email !== "") {
          await UserSchema.findOneAndUpdate(
            { _id: _args.id },
            {
              email: _args.email,
              languages: _args.languages,
              roles: _args.roles
            }
          )
            .exec()
            .then(d => {
              done = true;
              console.log("Updating user complete");
            })
            .catch(err => {
              console.error("❌ Updating user error", err);
            });
        } else if (_args.password !== "" && _args.email === "") {
          await bcrypt
            .hash(_args.password, 10)
            .then(hash => {
              done = true;
              UserSchema.findOneAndUpdate(
                { _id: _args.id },
                {
                  password: hash,
                  languages: _args.languages,
                  roles: _args.roles
                },
                (err, user) => {
                  if (err) console.error("❌ Updating user error", err);
                  if (user) {
                    console.log("Updating user complete");
                  }
                }
              );
            })
            .catch(err => {
              console.error("❌ Update user info error", err);
            });
        } else if (_args.password === "" && _args.email === "") {
          await UserSchema.findOneAndUpdate(
            { _id: _args.id },
            {
              languages: _args.languages,
              roles: _args.roles
            }
          )
            .exec()
            .then(d => {
              done = true;
              console.log("Updating user complete");
            })
            .catch(err => {
              console.error("❌ Updating user error", err);
            });
        } else {
          await bcrypt
            .hash(_args.password, 10)
            .then(hash => {
              done = true;
              UserSchema.findOneAndUpdate(
                { _id: _args.id },
                {
                  email: _args.email,
                  password: hash,
                  languages: _args.languages,
                  roles: _args.roles
                },
                (err, user) => {
                  if (err) console.error("❌ Updating user error", err);
                  if (user) {
                    console.log("Updating user complete");
                  }
                }
              );
            })
            .catch(err => {
              console.error("❌ Update user info error", err);
            });
        }
      }
      return done;
    },
    deleteUserInfo: async (_source, _args) => {
      let oldData = jwt.decode(_args.token);
      let done = false;

      // Διεγραφή του χρήστη από την συλλογή UserSchema
      await UserSchema.findOneAndDelete({ _id: oldData.id })
        .exec()
        .then(d => {
          if (d) {
            console.log("🗑 User Deleted!");
            done = true;
          } else {
            console.error("❌ User has not deleted!");
            done = false;
          }
        })
        .catch(e => {
          console.error("❌ User has not deleted!", e);
          done = false;
        });
      // Διεγραφή του χρήστη από την συλλογή SummonerSchema
      await SummonerSchema.deleteMany({ userId: oldData.id })
        .exec()
        .then(d => {
          if (d) {
            console.log("🗑 User Deleted!");
            done = true;
          } else {
            console.error("❌ User has not deleted!");
            done = false;
          }
        })
        .catch(e => {
          console.error("❌ User has not deleted!", e);
          done = false;
        });
      return done;
    }
  }
};
