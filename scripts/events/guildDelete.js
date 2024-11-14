const config = process.env
const { MessageEmbed } = require('discord.js');

module.exports = async (client, guild) => {
    const AlphaConsole = client.functions.console
	if (!guild.name) return;
    let dbserv = client.schemas['serv']
    const channel = await client.fetchWebhook(config.WEBHOOK1.split('|')[0], config.WEBHOOK1.split('|')[1]);

    var err = '\\✅ Sem'

    dbserv.deleteOne({ _id: `${guild.id}` }, async function (err) {
        if (err) {
            err = `\\❌ Erro: ${err}`
            AlphaConsole.log('[-GUILD] ERRO: '+err);
        }
    });

    const embed = new MessageEmbed()
        .setColor(config.botColor1)
        .setTitle(`${client.user.username} foi retirado de um servidor.`)
        .setDescription(`**Nome: \`${guild.name}\`\nID: \`${guild.id}\`\nMembros: \`${guild.memberCount}\`\nLocal preferido: \`${guild.preferredLocale}\`\nDelete server config erro: ${err}\nTotal de servidores: \`${(await client.shard.fetchClientValues("guilds.cache.size")).reduce((a, b) => b + a)}\`**`)
        .setTimestamp()
    return channel.send({ 
		username: client.user.username,
        avatarURL: client.user.avatarURL({ dynamic: true, format: "png" }),
        embeds: [embed]
	}).then().catch(() => null)
}