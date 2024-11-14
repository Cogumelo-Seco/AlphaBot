const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'emoji',
                description: 'Adicione um emoji, nome de emoji ou id de emoji',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26, 22, 11]
        this.name = ['emojiinfo', 'ei'];
        this.helpen = 'Send information about an emoji';
        this.help = 'Envia informações sobre um emoji';

        this.howToUsePT = '<emoji/id de emoji/nome de emoji>'
        this.howToUseEN = '<emoji/emoji id/emoji name>'
    }

    async run(message) {
        if (!this.args[0]) return message.alphaReplyError(this.structure.emojiinfo.embed_description)
        var arg = this.args[0].replace(/[^0-9]/g, '') || this.args[0]

        var emoji = message.guild.emojis.cache.find(emoji => emoji.name === arg) || message.guild.emojis.cache.find(emoji => emoji.id === arg)

        if (!emoji){
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(`${this.structure.emojiinfo.embed2_description} \`${arg}\``)
            return message.alphaReply({ embeds: [embed] })
        }

        let author = await emoji.fetchAuthor()

        var emojiurl = `https://cdn.discordapp.com/emojis/${emoji.id}.gif?size=2048`
        if (!emoji.animated) emojiurl = `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=2048`
        
        let embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .addFields(
                { name: `**📘 ${this.structure.emojiinfo.name}:**`, value: `\`\`\`${emoji.name}\`\`\``, inline: true},
                { name: '**📌 ID:**', value: `\`\`\`${emoji.id}\`\`\``, inline: true },
                { name: `**❣️ ${this.structure.emojiinfo.mention}:**`, value: `\`\`\`${emoji}\`\`\``, inline: false },
                { name: `**📆 ${this.structure.emojiinfo.created}:**`, value: `<t:${Math.floor(new Date(emoji.createdAt)/1000)}> \`(${this.formatTime(+new Date() - emoji.createdAt)})\``, inline: false},
                { name: `**👑 Author:**`, value:`\`${author.tag}\` \`(${author.id})\``, inline: false},
                { name: '**🔗 URL:**', value: `${emojiurl}`, inline: false },
            )
            .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || message.user.defaultAvatarURL})
            .setThumbnail(emojiurl)
        return message.alphaReply({ embeds: [embed] })
    }
}