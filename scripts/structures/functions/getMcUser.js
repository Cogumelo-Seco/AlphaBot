const request = require('node-superfetch');

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(props) {
        let user = props[0]
        
        return await request.get(`https://api.mojang.com/users/profiles/minecraft/${user}`).then((r) => r.body).catch((a) => null)
    }
}