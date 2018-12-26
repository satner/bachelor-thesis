import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { SummonerSchema, UserSchema } from "../models";
import { API_KEY, QUEUE, SEASON } from "../lol-config";
import { EMAIL, PASSWORD } from "../mail-settings";
import LeagueJs from "leaguejs";

const api = new LeagueJs(API_KEY, {
  // TODO: test burst mode
  caching: {
    isEnabled: true,
    defaults: { stdTTL: 120 } // add a TTL to all Endpoints
  }
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

      if (Object.keys(summonerValues).length !== 0) {
        query.summoner = { $elemMatch: summonerValues };
      } else {
        query.summoner = { $exists: true, $ne: [] }; // Gia na apokliso  tous user pou den expun dilwsei akoma accounts
      }

      return await UserSchema.find(query)
        .skip(_args.skip)
        .limit(_args.limit)
        .exec()
        .then()
        .catch(err => {
          console.error("❌ Get pagination users!" + err);
        });
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
      newSummoner.name = _args.summoner;
      newSummoner.server = _args.server;
      let matchDetails = [];
      let finalData = {};
      let timeStamps = [];
      // Cheak ama iparxei idi sto DB
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
            await api.Summoner.gettingByName(_args.summoner, _args.server)
              .then(data => {
                done = true;
                finalData.summonerInfo = data;
              })
              .catch(err => {
                console.log("❌ Summoner name IS NOT lol-API", err);
              });
          }
        })
        .catch(err => {
          console.error("❌ Add user error: search error");
        });

      if (done) {
        // Ean o xristis den einai sto DB and IPARXEI sto lol-API MPES edw
        let summonerNameApiPromise = api.League.gettingPositionsForSummonerId(
          finalData.summonerInfo.id,
          _args.server
        )
          .then(data => {
            finalData.summonerLeagueInfo = data[1]; // Ston index 1 einai ta flex
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
            finalData.startIndex = matchList.startIndex;
            finalData.endIndex = matchList.endIndex;
            finalData.totalGames = matchList.totalGames;
            matchList.matches.forEach(data => {
              timeStamps.push(data.timestamp);
            });
            return matchList.matches;
          })
          .catch(err => {
            console.error(
              "❌ >>> setSummonerInfo resolver: Match Endpoint Error: " + err
            );
          });

        summonerNameApiPromise.then(matchList => {
          Promise.all(
            matchList.map(async function(match) {
              await api.Match.gettingById(match.gameId, _args.server)
                .then(data => {
                  // Pernw to participantid tou summoner
                  let summonerID = data.participantIdentities.filter(function(
                    summoner
                  ) {
                    return summoner.player.summonerName === _args.summoner;
                  });

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
          ).then(async () => {
            finalData.summonerMatchDetails = matchDetails;
            finalData.userId = _args.id;
            finalData.summonerInfo.server = _args.server;
            finalData.matchesTimeline = timeStamps;
            SummonerSchema.create(finalData);
            newSummoner.tier = finalData.summonerLeagueInfo.tier;
            newSummoner.profileIconId = finalData.summonerInfo.profileIconId;
            newSummoner.summonerLevel = finalData.summonerInfo.summonerLevel;
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
        });
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
            console.log("🗑 Summoner Deleted!");
            done = true;
          } else {
            console.error("❌ Summoner has not deleted!");
            done = false;
          }
        })
        .catch(e => {
          console.error("❌ Summoner has not deleted!", e);
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
            console.log("🗑 Summoner Deleted!");
            done = true;
          } else {
            console.error("❌ Summoner has not deleted!");
            done = false;
          }
        })
        .catch(e => {
          console.error("❌ Summoner has not deleted!", e);
          done = false;
        });
      return done;
    },
    login: async (_source, _args) => {
      let token;
      await UserSchema.findOne({ email: _args.email })
        .exec()
        .then(async user => {
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
          await UserSchema.findOneAndUpdate(
            { email: _args.email },
            { resetPasswordToken: token }
          )
            .exec()
            .then(user => {
              if (user) {
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
                  text: "Hello world?",
                  html: `<a href=http://localhost:3000/reset-password?token=${token}>Click here to reset your password!</a>`
                };

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
      console.log("ddddddd", done);
      return done;
    },
    updateUserInfo: async (_source, _args) => {
      let done = false;

      if (_args.email !== "") {
        // Check if email already exists!
        await UserSchema.find({ email: _args.email })
          .exec()
          .then(user => {
            if (user.length >= 1) {
              console.log("Email already exists!");
              done = false;
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
