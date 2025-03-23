const { MessageEmbed } = require('discord.js');

module.exports = async (client, config, message, commandName) => {
    const channel = await client.fetchWebhook(config.WEBHOOK4.split('|')[0], config.WEBHOOK4.split('|')[1]);
    const embed = new MessageEmbed()
        .setTimestamp()
        .setColor(config.botColor1)
        .setThumbnail(message.guild.iconURL({ dynamic: true, format: "png", size: 1024 }))
        .setAuthor({ name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.avatarURL({ dynamic: true, format: "png", size: 2048 }) || message.author.defaultAvatarURL })
        .setDescription(`**<a:discord:777643298742468609> Servidor:** \`${message.guild.name} (${message.guild.id})\`\n**💬 Canal:** \`${message.channel.name} (${message.channel.id})\`\n**<a:engrenagem:805200447921061949> Comando:** \`${commandName}\`\n\n\`\`\`${message.content}\`\`\``)
    return channel.send({
        username: client.user.username,
        avatarURL: client.user.avatarURL({ dynamic: true, format: "png" }),
        embeds: [embed],
    }).catch(() => null)
}