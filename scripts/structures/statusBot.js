const Functions = require('./functions/index')

module.exports = async (client, config) => {
    const user = await client.users.fetch('741352048271818823')
    
    let activities = [
        `🧐| Já votou em mim hoje? @${client.user.username} votar`,
        `❤️| Seja incrível e vote em mim =) | top.gg/bot/766006179209936946`,
        `📄| Visite meu site para obter ajuda: https://alpha-site.vercel.app/`,
        `💬| ${client.channels.cache.size} Canais`,
        `🌎| ${client.guilds.cache.size} Servidores`,
        `👑| Bot criado por ${user ? user.tag : 'Cogu'}`,
        `🤖| Entre no server do meu criador discord.gg/33Zsrg5dTc`,
        //`🤷‍♂️| ${(await client.shard.fetchClientValues("users.cache.size")).reduce((a, b) => b + a)} Usuários`,
        `⏱️| Estou online á: ${new Functions({ client }).formatTime(client.uptime)}`
    ];

    return client.user.setActivity(`${activities[Math.floor(Math.random() * activities.length)] || 'p-p'}`, { type: 'PLAYING'})
	//return client.user.setActivity(`Adicione meu amigo Wordle Bot para jogar Wordle no Discord! https://botwordle.herokuapp.com/`, { type: 'PLAYING'})
};