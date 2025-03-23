const noblox = require('noblox.js')
const request = require('node-superfetch')

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(props) {
        const name = props[0].replace(/[^A-Za-z0-9]]/g, ' ')
        const games = await request.get(`https://games.roblox.com/v1/games/list?model.keyword=${name}`).then(r => r.body).catch(() => null).catch(() => null)
        console.log(games)
        const universeId = games.games[0]?.universeId
        const game = await noblox.getUniverseInfo(universeId).then(g => g[0]).catch(() => null)

        game.totalUpVotes = games.games[0].totalUpVotes
        game.totalDownVotes = games.games[0].totalDownVotes

        return game
    }
}