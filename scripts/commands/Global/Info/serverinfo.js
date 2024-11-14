const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'servidor',
                description: 'Adicione um id de servidor para ver informações',
                type: 3
            }
        ];
		this.clientPermissionLevel = [26, 22]
        this.name = ['serverinfo', 'guildinfo', 'si'];
        this.helpen = 'Sends information about the server';
        this.help = 'Envia informações sobre o servidor';

        this.howToUsePT = '[id de servidor]'
        this.howToUseEN = '[server id]'
    }

    async run(message) {
        let guild = await this.client.guilds.fetch(this.args[0] || message.guild).then().catch(() => message.guild);
        const embed = new MessageEmbed()

        let owner = await this.client.users.fetch(guild.ownerId).catch(() => null);
        
        embed
            .setColor(this.config.botColor1)
            .setThumbnail(guild.iconURL({ dynamic: true, format: "png", size: 1024 }))
            .setAuthor({ name: `🔍 ${this.structure.serverinfo.embed_author}` })
            .addFields(
                { name: `**👑 ${this.structure.serverinfo.embed_field1}**`, value: `\`${owner.tag} (${owner.id})\``, inline: false },
                { name: `**📘 ${this.structure.serverinfo.embed_field2}**`, value: `\`${guild.name}\``, inline: true },
                { name: `**📌 ID:**`, value: `\`${guild.id}\``, inline: true },
                { name: `**🌎 ${this.structure.serverinfo.embed_field3}**`, value: `\`${guild.preferredLocale}\``, inline: true },
                { name: `**📄 ${this.structure.serverinfo.embed_field5}**`, value: `\`${guild.roles.cache.size}\``, inline: true },
                //{ name: , value: , inline: true },
            )
        if (guild.memberCount) embed.addFields({ name: `**👥 ${this.structure.serverinfo.embed_field6}**`, value: `\`${guild.memberCount}\``, inline: true })
        embed
            .addFields({ name: `**💬 ${this.structure.serverinfo.embed_field4} (${(this.getChannels(guild, 'GUILD_VOICE') ? this.getChannels(guild, 'GUILD_VOICE').size : 0)+(this.getChannels(guild, 'GUILD_TEXT') ? this.getChannels(guild, 'GUILD_TEXT').size : 0)})**`, value: `📝 ${this.structure.serverinfo.text}: \`${this.getChannels(guild, 'GUILD_TEXT') ? this.getChannels(guild, 'GUILD_TEXT').size : 0}\`\n🗣️ ${this.structure.serverinfo.voice}: \`${this.getChannels(guild, 'GUILD_VOICE') ? this.getChannels(guild, 'GUILD_VOICE').size : 0}\``, inline: true })
            .addFields({ name: `**📅 ${this.structure.serverinfo.embed_field7}**`, value: `<t:${Math.floor(new Date(guild.createdAt)/1000)}> \`(${this.formatTime(+new Date - guild.createdAt)})\`` })
        if (guild.joinedTimestamp != null) embed.addFields({ name: `**📅 ${this.structure.serverinfo.embed_field9}**`, value: `<t:${Math.floor(new Date(guild.joinedTimestamp)/1000)}> \`(${this.formatTime(+new Date() - guild.joinedTimestamp)})\`` })
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setEmoji('◀️')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setEmoji('▶️')
                    .setStyle('SECONDARY'),
            );

        let msg = await message.alphaReply({ embeds: [embed], components: [row] })
        if (!msg) return

        msg.createMessageComponentCollector({ filter: i => i.user.id == message.user.id, time: 60000 })
        .on('end', () => {
            let components = msg.components
            for (let i in components) {
                for (let a in components[i].components) {
                    if (components[i].components[a].setPlaceholder) components[i].components[a].setPlaceholder(this.events.commands.timeout)
                    components[i].components[a].setDisabled(true)
                }                
            }
            msg.edit({ components }).catch(() => null)
        })
        .on('collect', async (i) => {
            await i.deferUpdate();

            let roles = guild.roles.cache.map(r => r)
            let rolesText = ''
            for (let i in roles) {
                if (roles[i].name != '@everyone' && i < 30) rolesText += `**\`${roles[i].name}\`${i >= roles.length ? '' : ','}** `
            }

            if (i.customId == 'next') {
                const embed2 = new MessageEmbed()
                    .setColor(this.config.botColor1)
                    .setThumbnail(guild.iconURL({ dynamic: true, format: "png", size: 1024 }))
                    .setAuthor({ name: `🔍 ${this.structure.serverinfo.embed_author}` })
                    .addFields({ name: `**📄 ${this.structure.serverinfo.embed_field5} (${guild.roles.cache.size})**`, value: rolesText.length > 800 ? `${rolesText.slice(0, 800)}...` : rolesText })
                msg.edit({ embeds: [embed2] }).catch(() => null)
            } else if (i.customId == 'previous') {
                msg.edit({ embeds: [embed] }).catch(() => null)
            }
        })
    }

    getChannels (guild, type) {
        if (!guild || !type) return;
        return guild.channels.cache.filter((channel) => {
            return channel.type === type
        })
    }
    async getUsers (guild, bot)  {
        if (!guild) return;
        let guildUsers = await guild.members.fetch()
        return guildUsers.filter((user) => {
            return user.user.bot === bot
        })
    }
}