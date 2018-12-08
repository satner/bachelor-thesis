import { UserSchema } from "../models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_KEY = 'kappa';

export default {
  Query: {
    getUserInfo: (_source, _args) => {

    },
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
      return await UserSchema.count({}, (err, result) =>{
        if (err) console.error('Getting total number of users error', err);
        return result
      })
    }
  },
  Mutation: {
    login: async (_source, _args) => {
      let token;
      await UserSchema.findOne({email: _args.email}, (err, user) => {
        if (err) console.error('Log in error');
        else {
          bcrypt.compare(_args.password, user.password, (err, res) => {
            if (err) console.error('Password wrong');
            if (res) {
              const t = jwt.sign({
                    email: user.email,
                    server: user.server,
                    languages: user.languages,
                    summoner: user.summoner
                  },
                  JWT_KEY,{
                    expiresIn: "1h"
                  });
              token = t
            }
          })
        }
      });
      return token
    },
    signup: async (_source, _args) => {
      let done = false;
      await UserSchema.find({
        $or: [
            {email: _args.email},
            {$and: [{summoner: _args.summoner}, {server: _args.server}]}
            ]
        }, (err, user) => {
        if (user) {
          console.log('User already exists!')
        }
        else {
          bcrypt.hash(_args.password, 10 , (err, hash) => {
            if (err) {
              console.error('Auth error')
            } else {
              const user = new UserSchema({
                email: _args.email,
                password: hash,
                server: _args.server,
                summoner: _args.summoner,
                languages: _args.languages
              });
              user.save()
                  .then(result => {
                    done = true;
                    console.log('User created!')
                  })
                  .catch(err => {
                    console.error('User has not created!')
                  })
            }
            if (err) console.error("User creation error")
          })
        }
      });
      return done
    },
    updateUserInfo: async (_source, _args) => {
      let oldData = jwt.decode(_args.token);

      bcrypt.hash(_args.password, 10 , (err, hash) => {
        if (err) {
          console.error('Auth error')
        } else {
          UserSchema.findOneAndUpdate({email: oldData.email}, {email: _args.email, password: hash, languages: _args.languages}, (err, user) => {
            if (err) console.error('Updating user error')
            if (user) console.log('Updating user complete')
          })

        }
        if (err) console.error("User update error")
      })

    },
    deleteUserInfo: (_source, _args) => {
      UserSchema.findOneAndDelete({email: _args.email}, (err, user) => {
        if (err) console.error('User has not deleted!');
        console.log('User deleted!')
      })
    }
  }
}