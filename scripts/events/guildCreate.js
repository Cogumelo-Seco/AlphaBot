const config = process.env;
const { MessageEmbed } = require('discord.js');

module.exports = async (client, guild) => {
    const AlphaConsole = client.functions.console
    let dbserv = client.schemas['serv']

    const channel = await client.fetchWebhook(config.WEBHOOK1.split('|')[0], config.WEBHOOK1.split('|')[1]);

    dbserv.findById(guild.id)
    .then(async function(result){
        if (!result) return require('../structures/configs/registerGuild')(client, guild, config)
    }).catch((err) => AlphaConsole.error('[+GUILD] ERRO: '+err));

    const embed = new MessageEmbed()
        .setColor(config.botColor1)
        .setTitle(`${client.user.username} está em um novo servidor.`)
        .setDescription(`**Nome: \`${guild.name}\`\nID: \`${guild.id}\`\nMembros: \`${guild.memberCount}\`\nLocal preferido: \`${guild.preferredLocale}\`\nTotal de servidores: \`${(await client.shard.fetchClientValues("guilds.cache.size")).reduce((a, b) => b + a)}\`**`)
        .setTimestamp()
    return channel.send({ 
		username: client.user.username,
        avatarURL: client.user.avatarURL({ dynamic: true, format: "png" }),
        embeds: [embed]
	}).catch(() => null)
}