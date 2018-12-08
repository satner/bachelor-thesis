const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: String,
    server: String,
    summoner: String,
    languages: Array
}, {
    timestamp: true
});

export default mongoose.model('userSchema', userSchema);