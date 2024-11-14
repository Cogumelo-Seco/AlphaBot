const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const requirePermissions = require('../../../structures/configs/permissions');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'cargo',
                description: 'Adicione um cargo',
                required: true,
                type: 8
            }
        ];
		this.clientPermissionLevel = [26, 22]
        this.name = ['roleinfo', 'cargoinfo', 'ri'];
        this.helpen = 'Displays information about a role';
        this.help = 'Exibe informações sobre um cargo';

        this.howToUsePT = '<cargo/id de cargo>'
        this.howToUseEN = '<role/role id>'
    }

    async run(message) {
        var arg = this.args[0] ? this.args[0].replace(/[<@&>]/g, '') : null;
        const embed = new MessageEmbed()

        if (!arg) {
            embed
                .setColor(this.config.colorerr)
                .setTitle(this.events.commands.incorrectParameters)
                .setDescription((this.structure.roleinfo.noArgs).replace('{{roleID}}', message.guild.roles.cache.map(a=>a)[0].id))
            return message.alphaReply({ embeds: [embed] })
        }

        let serverRoles = message.guild.roles.cache
        var role = serverRoles.filter((p) => p.name.toLowerCase() === arg.toLowerCase() ||  p.id === arg).map((a) => a)[0]

        if (!role) return message.alphaReplyNot((this.structure.roleinfo.noFind).replace('{{args}}', this.args[0]))

        let roleColor = role.hexColor
        if (role.color == 0) roleColor = '#2f3136'
        
        embed
            .setColor(roleColor || this.config.botColor1)
            .setAuthor({ name: `📋 | ${role.name}` })
            .setThumbnail(message.guild.iconURL({ dynamic: true, format: "png", size: 1024 }))
            .addFields(
                { name: `**❣️ ${this.structure.roleinfo.mention}:**`, value: `\`<@&${role.id}>\``, inline: true },
                { name: `**📌 ID:**`, value: `\`${role.id}\``, inline: true },
                { name: `**🎨 ${this.structure.roleinfo.color}:**`, value: `\`${roleColor}\` \`(${role.color})\``, inline: false },
                { name: `**🏓 ${this.structure.roleinfo.mentionable}:**`, value: `${role.mentionable ? '<:on:785886074924564573>' : '<:off:785886043597570058>'}`, inline: false },
                { name: `**📚 ${this.structure.roleinfo.separate}:**`, value: `${role.hoist ? '<:on:785886074924564573>' : '<:off:785886043597570058>'}`, inline: false },
                { name: `**📆 ${this.structure.roleinfo.created}:**`, value: `<t:${Math.floor(new Date(role.createdAt)/1000)}> \`(${this.formatTime(+new Date() - role.createdAt)})\``, inline: false}
            )
            .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || message.user.defaultAvatarURL })

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
            for (let i = 0; i < role.permissions.toArray().length; i++) {
                if (this.structure.type == 'pt-BR')
                    permissions += `\`${permissionsNames.filter(p => p.name == role.permissions.toArray()[i])[0].name_PT}\`${i == role.permissions.toArray().length-1 ? '' : ', '}`
                else {
                    let str = role.permissions.toArray()[i]
                    let permission = str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())
                    permissions += `\`${permission}\`${i == role.permissions.toArray().length-1 ? '' : ', '}`
                }
            }

            if (i.customId == 'next') {
                const embed2 = new MessageEmbed() 
                    .setColor(roleColor || this.config.color)
                    .addField(`**📑 ${role.name} ${this.structure.userinfo.permissions} (${role.permissions.toArray().length})**`, `**${permissions}**`)
                    .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.displayAvatarURL({ format :  "png", dynamic: true }) || message.user.defaultAvatarURL })
                    .setTimestamp();
                msg.edit({ embeds: [embed2] }).then().catch(() => null)
            } else if (i.customId == 'previous') {
                msg.edit({ embeds: [embed] }).catch(() => null)
            }
        })
    }
}
