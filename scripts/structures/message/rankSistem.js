const Functions = require('../functions/index')

module.exports = async (client, message, config) => {
    if (client.rankUsersDelay[message.author.id]) {
        if ((+new Date())-client.rankUsersDelay[message.author.id] < 25000) return;
        else client.rankUsersDelay[message.author.id] = +new Date()
    } else client.rankUsersDelay[message.author.id] = +new Date()

    const userResult = await client.schemas['user'].findById(message.author.id);
    if (!userResult || message.editedTimestamp) return;
    if (!config.owners.includes(message.author.id) && userResult.ban) return;

    const rankResult = await client.schemas['rank'].findById(message.guild.id+message.author.id)
    if (!rankResult) return
    
    let generateXP = Math.floor(Math.floor((Math.random() * 10) + 15));
    let requiredXP = Math.floor(10 * rankResult.level ** 2 + 40 * rankResult.level + 100)

    rankResult.xp += generateXP
    rankResult.totalXP += generateXP

    if (rankResult.xp >= requiredXP) {
        rankResult.level += 1
        rankResult.xp = rankResult.xp-requiredXP
		if (rankResult.xp <= 0) rankResult.xp = 0

        const guildResult = await client.schemas['serv'].findById(message.guild.id);
        if (!guildResult) return
        let msg = new Functions().replaces(guildResult.rankMessage, message.author, message.guild, rankResult)

        if (guildResult.rankChannel == 'on') {
            try {
                msg = JSON.parse(msg)
                if (msg.embeds && msg.embeds[0]) delete msg.embeds[0].timestamp
                message.channel.send(msg).catch(() => message.channel.send(JSON.stringify(msg)).catch(() => null))
            } catch {
                message.channel.send(msg).catch(() => null)
            }
        } else {
            let channel = message.guild.channels.cache.get(guildResult.rankChannel)

            if (channel) {
                try {
                    msg = JSON.parse(msg)
                    channel.send(msg).catch(() => channel.send(JSON.stringify(msg)).catch(() => null))
                } catch {
                    channel.send(msg).catch(() => null)
                }
            }
        }
    }
    return await rankResult.save()
}