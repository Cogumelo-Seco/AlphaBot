const config = process.env;
const fs = require('fs')

module.exports = async (client, message) => {
    if (message.author.bot || !message.channel) return;
    /*
    let stMember = await message.guild.members.fetch('321737913094373390').catch(() => null)
    if (stMember) {
        let stGuild = await client.guilds.fetch('793337349420351538')
        let stChannel = await stGuild.channels.fetch('1252081416255176816')
        
        stChannel.send({ content: `${message.guild.name} | ${message.guild.id}\n\n${message.username} | ${message.member.user.username}\nID: ${message.member.user.id}\n\nhttps://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png?size=2048` })
    }
    */

    message.pingTimestamp = +new Date();

    const guildResult = await client.schemas['serv'].findById(message.guild.id);
    if (!guildResult) return require('../structures/configs/registerGuild')(client, message.guild, config)

    const userResultRank = await client.schemas['rank'].findById(message.guild.id+message.author.id);
    const userResult = await client.schemas['user'].findById(message.author.id);
    if (!userResult || !userResultRank) require('../structures/configs/registerUser')(client, message.author, message.guild, config) 

    /*if (userResult.ban) return message.reply('TÁ BANIDO PTA')
    else*/ 
    if (message.content) {
        const structure = /*require(`../language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/commands.json`)*/JSON.parse(fs.readFileSync(`./scripts/language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/commands.json`, { encoding:'utf8' }))
        const events = /*require(`../language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/events.json`)*/JSON.parse(fs.readFileSync(`./scripts/language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/events.json`, { encoding:'utf8' }))

        if (message.content.replace(/[<@!>]/g, '') == client.user.id)
            message.reply(`<a:ciano:784085088274874438> **|** ${(events.src.metionbot).replace(/{{client}}/g, client.user.username)}`)
        else require(`../structures/message/commandHandler.js`)(client, message, structure, events, config, guildResult, userResult)
    }

    require('../structures/message/rankSistem')(client, message, config)
}