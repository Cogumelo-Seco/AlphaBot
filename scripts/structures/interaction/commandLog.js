const { MessageEmbed } = require('discord.js');

module.exports = async (client, config, interaction) => {
    const channel = await client.fetchWebhook(config.WEBHOOK4.split('|')[0], config.WEBHOOK4.split('|')[1]);
    const embed = new MessageEmbed()
        .setTimestamp()
        .setColor(config.botColor2)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: "png", size: 1024 }))
        .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || interaction.user.defaultAvatarURL })
        .setDescription(`**<a:discord:777643298742468609> Servidor:** \`${interaction.guild.name} (${interaction.guild.id})\`\n**💬 Canal:** \`${interaction.channel.name} (${interaction.channel.id})\`\n**<a:engrenagem:805200447921061949> Comando:** \`${interaction.commandName}\`\n\n\`\`\`${interaction.content}\`\`\``)
    return channel.send({
        username: client.user.username,
        avatarURL: client.user.avatarURL({ dynamic: true, format: "png" }),
        embeds: [embed],
    }).catch(() => null)
}