const fetch = require("node-fetch");

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(channelName) {
        let res = await fetch(`https://api.twitch.tv/helix/users?login=${channelName}`, {
            method: 'GET',
            json: true,
            headers: {
                'Authorization': `Bearer ${process.env.twitchAppTOKEN}`,
                'Client-Id': process.env.twitchAppID,
                'Content-Type':'application/json'
            }
        }).then(res => res.json()).catch(err => null)

        return res?.data ? res.data[0] || null : null
    }
}