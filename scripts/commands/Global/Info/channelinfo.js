const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'canal',
                description: 'Adicione um canal',
                type: 7
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['channelinfo', 'canalinfo', 'ci'];
        this.helpen = 'Send information about an channel';
        this.help = 'Envia informações sobre um canal';

        this.howToUsePT = '<canal/id de canal>'
        this.howToUseEN = '<channel/channel id>'
    }

    async run(message) {
        let arg = this.args[0] ? this.args[0].replace(/[<#>]/g, '') : null || message.channel.id;

        let channel = await this.client.channels.fetch(arg).then().catch((a) => { return null } )

        if (!channel){
            const embed = new MessageEmbed()
                .setColor(this.config.colorerr)
                .setDescription(`${this.structure.channelinfo.embed_description} \`${arg}\``)
            return message.alphaReply({ embeds: [embed] })
        }

        let type = channel.type

        let topic = channel.topic ? channel.topic.split('', 62).join('') : this.structure.channelinfo.noTopic;
        let slowmode = '<:off:785886043597570058>'
        let nsfw = '<:off:785886043597570058>'
        let userLimit = '<:off:785886043597570058>'
        if (channel.rateLimitPerUser != 0) slowmode = '<:on:785886074924564573>'
        if (channel.nsfw) nsfw = '<:on:785886074924564573>'
        if (channel.userLimit != 0) userLimit = channel.userLimit

        var embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || message.user.defaultAvatarURL})

        if (type == 'GUILD_TEXT') {
            embed.addFields(
                { name: `**📘 ${this.structure.channelinfo.name}:**`, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                { name: '**📌 ID:**', value: `\`\`\`${channel.id}\`\`\``, inline: true },
                { name: '**🧷 Type:**', value: `\`\`\`${channel.type}\`\`\``, inline: true },
                { name: `**❣️ ${this.structure.channelinfo.mention}:**`, value: `\`\`\`<#${channel.id}>\`\`\``, inline: true },
                { name: `**👑 ${this.structure.channelinfo.server}:**`, value: `\`\`\`${channel.guild.name}\`\`\``, inline: true },
                { name: `**📆 ${this.structure.channelinfo.created}:**`, value: `<t:${Math.floor(new Date(channel.createdAt)/1000)}> \`(${this.formatTime(+new Date() - channel.createdAt)})\``, inline: false},
                { name: `**🐢 ${this.structure.channelinfo.slowmode}:**`, value: `${slowmode}`, inline: true },
                { name: `**🔞 NSFW:**`, value: `${nsfw}`, inline: true },
                { name: `**📑 ${this.structure.channelinfo.topic}:**`, value: `\`${topic}\``, inline: true },
            )
        } else if (type == 'GUILD_VOICE') {
            embed.addFields(
                { name: `**📘 ${this.structure.channelinfo.name}:**`, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                { name: '**📌 ID:**', value: `\`\`\`${channel.id}\`\`\``, inline: true },
                { name: '**🧷 Type:**', value: `\`\`\`${channel.type}\`\`\``, inline: true },
                { name: `**❣️ ${this.structure.channelinfo.mention}:**`, value: `\`\`\`<#${channel.id}>\`\`\``, inline: true },
                { name: `**👑 ${this.structure.channelinfo.server}:**`, value: `\`\`\`${channel.guild.name}\`\`\``, inline: true },
                { name: `**📆 ${this.structure.channelinfo.created}:**`, value: `<t:${Math.floor(new Date(channel.createdAt)/1000)}> \`(${this.formatTime(+new Date() - channel.createdAt)})\``, inline: false},
                { name: `**🔉 Bitrate:**`, value: `${channel.bitrate/1000}Kbs`, inline: true },
                { name: `**📥 ${this.structure.channelinfo.membersSize}:**`, value: `${channel.members.size}`, inline: true },
                { name: `**🚫 UserLimit:**`, value: `${userLimit}`, inline: true },
            )
        } else {
            embed.addFields(
                { name: `**📘 ${this.structure.channelinfo.name}:**`, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                { name: '**📌 ID:**', value: `\`\`\`${channel.id}\`\`\``, inline: true },
                { name: '**🧷 Type:**', value: `\`\`\`${channel.type}\`\`\``, inline: true },
                { name: `**❣️ ${this.structure.channelinfo.mention}:**`, value: `\`\`\`<#${channel.id}>\`\`\``, inline: true },
                { name: `**👑 ${this.structure.channelinfo.server}:**`, value: `\`\`\`${channel.guild.name}\`\`\``, inline: true },
                { name: `**📆 ${this.structure.channelinfo.created}:**`, value: `<t:${Math.floor(new Date(channel.createdAt)/1000)}> \`(${this.formatTime(+new Date() - channel.createdAt)})\``, inline: false},
            )
        }

        return message.alphaReply({ embeds: [embed] })
    }
}