﻿const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const requirePermissions = require('../../../structures/configs/permissions');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para ver informações',
                type: 6
            }
        ];
		this.clientPermissionLevel = [26, 22]
        this.name = ['userinfo', 'ui'];
        this.helpen = 'Sends information about you or someone else';
        this.help = 'Envia informações sobre o seu usuário ou de alguém';

        this.howToUsePT = '[usuário/id de usuário]'
        this.howToUseEN = '[user/userID]'
    }

    async run(message) {
        let member = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : message.user.id).catch(() => null)
        let clientUsers = await this.client.users.fetch(this.args[0]).catch(() => message.member)
        let user = member || clientUsers

        const result = await this.client.schemas['user'].findById(user.user ? user.user.id : user.id);
        const marry = await this.client.users.fetch(result ? result.marryID : null).catch(() => null)

        if (user.guild) {
            let bot = user.user.bot ? this.structure.userinfo.yes : this.structure.userinfo.not

            let counter = 0
            let roles = user.roles.cache.map(r => r)
            let rolesText = ''
            for (let i in roles) {
                if (roles[i].name != '@everyone' && counter <= 10) {
                    counter++
                    rolesText += `<@&${roles[i].id}> `
                }
            }

            let badges = await this.badges(user, message, this.config, this.client)
            
            const embed = new MessageEmbed() 
                .setColor(result ? result.color : this.config.botColor1)
                .setThumbnail(user.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || user.user.defaultAvatarURL)
                .setAuthor({ name: user.nickname || user.user.username })
                .addFields({ name: '**📘 Tag**', value: `\`${user.user.tag}\``, inline: true })
                .addFields({ name: '**🤖 Bot**', value: `\`${bot}\``, inline: true })
                .addFields({ name: '**📌 ID**', value: `\`${user.user.id}\``, inline: false })
            if (badges) embed.addFields({ name: `🚩 Badges`, value: `${badges}`, inline: false })
            embed
                .addFields({ name: `**💎 ${this.structure.userinfo.embed_field1} ${this.client.user.username}**`, value: `\`${result ? result.diamonds+result.bank : 0} 💎\``, inline: false })
            if (marry) embed.addFields({ name: `**:ring: ${this.structure.userinfo.embed_field5}**`, value: `\`${marry.tag} (${marry.id})\`` })
            embed
                .addFields({ name: `**📋 ${this.structure.userinfo.embed_field3} (${user._roles.length})**`, value: rolesText || '** **', inline: false })
                .addFields({ name: `**📅 ${this.structure.userinfo.embed_field2}**`, value: `<t:${Math.floor(new Date(user.user.createdAt)/1000)}> \`(${this.formatTime(+new Date() - user.user.createdAt)})\`` })
                .addFields({ name: `**📅 ${this.structure.userinfo.embed_field4}**`, value: `<t:${Math.floor(new Date(user.joinedAt)/1000)}> \`(${this.formatTime(+new Date() - user.joinedAt)})\`` })

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

                let permissionsNames = []
                for (let i in requirePermissions) permissionsNames.push(requirePermissions[i])
                let permissions = ''
                for (let i = 0; i < user.permissions.toArray().length; i++) {
                    if (this.structure.type == 'pt-BR') 
                        permissions += `\`${permissionsNames.filter(p => p.name == user.permissions.toArray()[i])[0].name_PT}\`${i == message.member.permissions.toArray().length-1 ? '' : ', '}`
                    else {
                        let str = user.permissions.toArray()[i]
                        let permission = str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())
                        permissions += `\`${permission}\`${i == user.permissions.toArray().length-1 ? '' : ', '}`
                    }
                }

                if (i.customId == 'next') {
                    const embed2 = new MessageEmbed() 
                        .setColor(result ? result.color : this.config.botColor1)
                        .setThumbnail(user.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || user.user.defaultAvatarURL)
                        .setAuthor({ name: user.nickname || user.user.username })
                        .addFields({ name: `**📑 ${this.structure.userinfo.permissions} (${user.permissions.toArray().length})**`, value: `**${permissions}**` })
                    msg.edit({ embeds: [embed2] }).catch(() => null)
                } else if (i.customId == 'previous') {
                    msg.edit({ embeds: [embed] }).catch(() => null)
                }
            })
        } else {
            let bot = user.bot ? this.structure.userinfo.yes : this.structure.userinfo.not
            let badges = await this.badges(user, message, this.config, this.client)

            const embed = new MessageEmbed() 
                .setColor(result ? result.color : this.config.botColor1)
                .setThumbnail(user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || user.defaultAvatarURL)
                .setAuthor({ name: `🔍 ${user.username}` })
                .addFields({ name: '**📘 Tag**', value: `\`${user.tag}\``, inline: true })
                .addFields({ name: '**🤖 Bot**', value: `\`${bot}\``, inline: true })
                .addFields({ name: '**📌 ID**', value: `\`${user.id}\``, inline: false })
            if (badges) embed.addFields({ name: `🚩 Badges`, value: `${badges}`, inline: false })
            embed
                .addFields({ name: `**💎 ${this.structure.userinfo.embed_field1} ${this.client.user.username}**`, value: `\`${result ? result.diamonds+result.bank : 0} 💎\``, inline: false })
                .addFields({ name: `**📅 ${this.structure.userinfo.embed_field2}**`, value: `<t:${Math.floor(new Date(user.createdAt)/1000)}>  \`(${this.formatTime(+new Date() - user.createdAt)})\`` })
            return message.alphaReply({ embeds: [embed] })
        }
    }
}