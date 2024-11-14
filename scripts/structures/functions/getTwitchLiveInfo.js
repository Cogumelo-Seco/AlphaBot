const fetch = require("node-fetch");

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(channelID) {
        let res = await fetch(`https://api.twitch.tv/helix/streams?user_id=${channelID}`, {
            method: 'GET',
            json: true,
            headers: {
                'Authorization': `Bearer ${process.env.twitchAppTOKEN}`,
                'Client-Id': process.env.twitchAppID,
                'Content-Type':'application/json'
            }
        }).then(res => res.json()).catch(err => null)

        return res ? res.data[0] || null : null
    }
}