const { API_TOKEN } = process.env
const DBL = require("dblapi.js");

module.exports = async (client) => {
    const AlphaConsole = client.functions.console

	try {
        const dbl = new DBL(API_TOKEN, client)
		const Topgg = require('@top-gg/sdk')

		const api = new Topgg.Api(API_TOKEN)

        dbl.on('error', e => {
            AlphaConsole.error(`[TOP.GG] Opa! ${e}`);
        })

        dbl.on('posted', () => {
            AlphaConsole.log('Contagem de servidores postada!');
        });

        async function post() {
            let serverCount = client.guilds.cache.size || 200
            let shardId = client.shard.ids[0]
            let shardCount = client.options.shardCount

            api.postStats({ serverCount, shardId, shardCount })
                .then(() => AlphaConsole.log('Contagem de servidores postada!'))
                .catch((err) => AlphaConsole.error(`[TOP.GG]  ${err}`))
        }

        post()
		setInterval(post, 1800000) // 30 minutos
    } catch (err){
        AlphaConsole.error(`[TOP.GG] ${err}`)
	}
}