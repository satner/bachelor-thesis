const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: String,
    summoner: [{
        name: String,
        server: String,
        tier: String
    }],
    languages: Array,
    roles: Array
}, {
    timestamp: true
});

export default mongoose.model('userSchema', userSchema);