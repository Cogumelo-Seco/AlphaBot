const mongo = require('mongoose');

const execute = (client) => {
    const rankSchema = new mongo.Schema({
        _id: {
            type: String,
            required: true
        },
        guildID: {
            type: String,
            required: true
        },
        userID: {
            type: String,
            required: true
        },
        xp: {
            type: Number,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        totalXP: {
            type: Number,
            required: true
        }
    }, { titmestamps: true });

    let rank = mongo.model("rank", rankSchema)
    client.schemas['rank'] = rank
}

module.exports = execute;