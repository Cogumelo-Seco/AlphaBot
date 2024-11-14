const mongo = require('mongoose');

const execute = (client) => {
    let userSchema = new mongo.Schema({
        _id: {
            type: String,
            required: true
        },
        diamonds: {
            type: Number,
            required: true
        },
        diamondsDelay: {
            type: Number,
            required: true
        },
        alphaCoins: {
            type: Number,
            required: true
        },
        alphaCoinsDelay: {
            type: Number,
            required: true
        },
        bank: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        aboutme: {
            type: String,
            required: true
        },
        ban: {
            type: Boolean,
            required: true
        },
        commandsCounter: {
            type: Number,
            required: true
        },
        voteCounter: {
            type: Number,
            required: true
        },
        marryID: {
            type: String,
            required: true
        },
        magicstones: {
            type: Number,
            required: true
        },
        RPGPlayer: {
            type: Object,
            required: true
        }
    }, { titmestamps: true });

    let user = mongo.model("user", userSchema)
    client.schemas['user'] = user
}

module.exports = execute;