import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UserSchema} from "../models";

// oi tris katw lines gia na epistrefei to id pou einai tipou _bsontype
const ObjectId = require('mongoose').Types.ObjectId;
ObjectId.prototype.valueOf = function () {
  return this.toString();
};

const JWT_KEY = 'kappa';

export default {
  Query: {
    getAllUsers: async (_source, _args) => {
      return await UserSchema.find({})
          .skip(_args.skip)
          .limit(_args.limit)
          .exec()
          .then()
          .catch(err => {
            console.error('Get all users error!' + err)
          })
    },
    getTotalNumberUsers: async (_source, _args) => {
      return await UserSchema.count({}, (err, result) => {
        if (err) console.error('Getting total number of users error', err);
        return result
      })
    },
    getUserInfos: async (_source, _args) => {
      return await UserSchema.findOne({_id: _args.id}, (err, user) => {
        if (err) console.error('Getting user info error!')
        return user
      })
    }
  },
  Mutation: {
    addSummoner: async (_source, _args) => {
    //  TODO: check if another summoner-name exists already
    //  TODO: check if summoner exist LOL-API side
      let done = false;
      let temp = {}
      temp.name = _args.summoner;
      temp.server = _args.server;
      await UserSchema.findOneAndUpdate({_id: _args.id}, {$push: {summoner: temp}})
          .exec()
          .then(d => {
            console.log('Summoner added!');
            done = true
          })
          .catch(e => {
            console.error('Add summoner error!', e)
          });
      return done
    },
    deleteSummoner: async (_source, _args) => {
      let done = false;
      await UserSchema.findByIdAndUpdate(_args.id, {$pull: {summoner: {name: _args.summoner, server: _args.server}}})
          .exec()
          .then(d => {
            console.log('Summoner Deleted!')
            done = true
          })
          .catch(e => {
            console.error('Summoner has not deleted!', e)
          })
      return done
    },
    login: async (_source, _args) => {
      let token;
      await UserSchema.findOne({email: _args.email})
          .exec()
          .then(async user => {
            await bcrypt.compare(_args.password, user.password)
                .then(res => {
                  if (res) {
                    token = jwt.sign({
                          id: user._id,
                          email: user.email,
                          languages: user.languages,
                        },
                        JWT_KEY, {
                          expiresIn: "1h"
                        });
                  } else {
                    console.error('Password invalid');
                  }
                })
          })
          .catch(err => {
            console.error('Password invalid', err)
          });
      return token
    },
    signup: async (_source, _args) => {
      let done = false;
      await UserSchema.find({email: _args.email})
          .exec()
          .then(async user => {
            if (user.length === 1) {
              console.log('User already exists!')
            } else {
              done = true;
              await bcrypt.hash(_args.password, 10)
                  .then(hash => {
                    const user = new UserSchema({
                      email: _args.email,
                      password: hash,
                      languages: _args.languages
                    });
                    user.save()
                        .then(result => {
                          console.log('User created!')
                        })
                        .catch(err => {
                          console.error('User has not created!')
                        })
                  })
                  .catch(err => {
                    console.error('User create error', err)
                  })
            }
          })
          .catch(err => {
            console.error('User create error', err)
          });
      return done
    },
    updateUserInfo: async (_source, _args) => {
      let oldData = jwt.decode(_args.token);
      let done = false;

      await bcrypt.hash(_args.password, 10)
          .then(hash => {
            done = true;
            UserSchema.findOneAndUpdate({email: oldData.email}, {
              email: _args.email,
              password: hash,
              languages: _args.languages
            }, (err, user) => {
              if (err) console.error('Updating user error');
              if (user) {
                console.log('Updating user complete');
              }
            });
          })
          .catch(err => {
            console.error('Update user info error', err)
          });
      return done
    },
    deleteUserInfo: async (_source, _args) => {
      let oldData = jwt.decode(_args.token);
      let done = false;

      await UserSchema.findOneAndDelete({_id: oldData.id})
          .exec()
          .then(user => {
            if (user) {
              console.log('User deleted!');
              done = true;
            }
          })
          .catch(err => {
            console.error('User has not deleted!', err);
          });
      return done
    }
  }
}