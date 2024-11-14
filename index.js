require('dotenv').config()
const AlphaConsole = (new (require('./scripts/structures/functions/index'))).console
const { ShardingManager } = require('discord.js');
const { TOKEN, shardsCount } = process.env;

const manager = new ShardingManager('./load.js', {
	execArgv: ['--trace-warnings'],
	totalShards: 'auto',
    token: TOKEN
});

manager.on('shardCreate', shard => {
    AlphaConsole.log(`Iniciando shard ${shard.id}`)

    shard.on('ready', () => {
        AlphaConsole.custom('bgGreen', 'brightGreen', `Shard ${shard.id} pronta`)
    })

    shard.on('disconnect', (a, b) => {
        AlphaConsole.error(`Shard ${shard.id} desconectada`)
        if (a) AlphaConsole.error(a)
        if (b) AlphaConsole.error(b)
    })
    shard.on('reconnecting', (a, b) => {
        AlphaConsole.warn(`Shard ${shard.id} reconectando`)
        if (a) AlphaConsole.warn(a)
        if (b) AlphaConsole.warn(b)
    })
    shard.on('death', (a, b) => {
        AlphaConsole.error(`Shard ${shard.id} morreu`)
        if (a) AlphaConsole.error(a)
        if (b) AlphaConsole.error(b)
    })

    shard.on('error', (err) => {
        AlphaConsole.error(`Shard ${shard.id} erro`)
        AlphaConsole.error(err)
    })
})

manager.spawn()
    .then(AlphaConsole.log('Iniciando shards...'))
    .catch((err) => AlphaConsole.error(err))