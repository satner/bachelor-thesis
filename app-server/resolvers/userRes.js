import { UserSchema } from "../models";
import bcrypt from 'bcrypt'

export default {
    Query: {
        getUserInfo: (_source, _args) => {

        },
        getAllUsers: async (_source, _args) => {
            return await UserSchema.find({}, (err, users) => {
                if (err) console.error('Return all users error')
                else return users
            })
        },
    },
    Mutation: {
        signup: (_source, _args) => {
            UserSchema.findOne({email: _args.email}, (err, user) => {
                if (user) { // User already exists!
                    console.log('User already exists!')
                } else {
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
                            })
                            user.save()
                                .then(result => {
                                    console.log('User created!')
                                })
                                .catch(err => {
                                    console.error('User has not created!')
                                })
                        }
                    })
                }
            })

        },
        updateUserInfo: (_source, _args) => {

        },
        deleteUserInfo: (_source, _args) => {
            UserSchema.findOneAndDelete({email: _args.email}, (err, user) => {
                if (err) console.error('User has not deleted!')
                console.log('User deleted!')
            })
        }
    }
}