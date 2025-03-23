const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um nome de usuário Roblox para ver informações',
                required: true,
                type: 3
            }
        ];
        this.clientPermissionLevel = [26]
        this.name = ['rbuser', 'robloxuser'];
        this.help = 'Mostra informações de um usuário roblox';
        this.helpen = 'Show information of a roblox user';
        this.howToUsePT = '<nome de um jogador roblox>'
        this.howToUseEN = '<name of a roblox player>'
    }

    async run(message) {
        let player = await this.getRbUser(this.args.join(' '))
        if (!player) return message.alphaReplyError(this.events.commands.invalidPlayer)

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setThumbnail(player.thumbnail_default[0].imageUrl)
            .setAuthor({ name: player.displayName != '' ? `${player.displayName} (@${player.username})` : `@${player.username}`, iconURL: player.thumbnail_circHeadshot[0].imageUrl} )
            .addFields({ name: `**📌 ID:**`, value: `\`${player.id}\``, inline: true })
            .addFields({ name: `**❌ ${this.structure.rbuser.ban}:**`, value: `\`${player.isBanned ? this.structure.rbuser.yes : this.structure.rbuser.not}\``, inline: true })
            .addFields({ name: `**🙋 Social:**`, value: `🫂 ${this.structure.rbuser.friends}: \`${player.friendCount}\`\n🤩 ${this.structure.rbuser.followers}: \`${player.followerCount}\`\n😳 ${this.structure.rbuser.following}: \`${player.followingCount}\`\n`, inline: false })
        if (player.blurb && player.blurb != '') embed.addField(`**<:caf:778788499293339679> Sobre:**`, `\`${player.blurb.slice(0, 440)}\``, false)
		embed
            .addFields({ name: `**📅 ${this.structure.rbuser.enteredInto}:**`, value: `<t:${Math.floor(new Date(player.joinDate)/1000)}> \`(${this.formatTime(+new Date() - player.joinDate)})\``, inline: false })
            .setImage(`attachment://rbBadges.png`)

        return message.alphaReply({ embeds: [embed] })
    }
}