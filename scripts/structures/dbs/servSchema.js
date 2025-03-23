const mongo = require('mongoose');

const execute = (client) => {
    const servSchema = new mongo.Schema({
        _id: {
            type: String,
            required: true
        },
        rankChannel: {
            type: String,
            required: true
        },
        rankMessage: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        welcomeChannel: {
            type: String,
            required: true
        },
        welcomeMessage: {
            type: String,
            required: true
        },
        leaveChannel: {
            type: String,
            required: true
        },
        leaveMessage: {
            type: String,
            required: true
        },
        YTChannelsToNotify: {
            type: Array,
            required: true
        },
        YTNotificationChannel: {
            type: String,
            required: true
        },
        YTNotificationText: {
            type: String,
            required: true
        },
        TWChannelsToNotify: {
            type: Array,
            required: true
        },
        TWNotificationChannel: {
            type: String,
            required: true
        },
        TWNotificationText: {
            type: String,
            required: true
        },
    }, { titmestamps: true });
    let serv = mongo.model("serv", servSchema)
    client.schemas['serv'] = serv
}

module.exports = execute;