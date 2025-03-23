const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para ver o perfil',
                type: 6
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['perfil', 'profile'];
        this.helpen = 'Send your profile or someone else\'s';
        this.help = 'Envia o seu perfil ou de alguém';

		this.howToUsePT = '[usuário/id de usuário]'
        this.howToUseEN = '[user/userID]'
    }

    async run(message) {
		let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)

		const result = await this.client.schemas['user'].findById(user.id);
		let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || user.defaultAvatarURL

		let badges = await this.badges(user, message, this.config, this.client)

		let marry = await this.client.users.fetch(result ? result.marryID : null).catch(() => null)

		let embed = new MessageEmbed()
			.setColor(result ? result.color : this.config.botColor1)
			.setAuthor({ name: `${this.structure.perfil.embed_author} ${user.username}`, iconURL: avatar })
			.setThumbnail(avatar)
			.addFields({ name: `**<:caf:778788499293339679> ${this.structure.perfil.embed_field1}:**`, value: `\`\`\`${result ? result.aboutme : 'Sou uma pessoa que gosta muito do Alpha ❤️'}\`\`\``, inline: false })
			if (result && result.marryID != 'off') embed.addFields({ name: `**:ring: ${this.structure.perfil.embed_field4}:**`, value: `\`${marry.tag} (${marry.id})\`` })
			embed.addFields({ name: `**💎 ${this.structure.perfil.embed_field2}:**`, value: `\`${result ? result.bank : 0}💎\``, inline: true })
			if (badges) embed.addFields({ name: `**🚩 Badges:**`, value: badges, inline: true })
			embed.addFields({ name: '** **', value: '** **', inline: true })
			embed.addFields({ name: `**⌨️ ${this.structure.perfil.embed_field3}:**`, value: `\`${result ? result.commandsCounter : 0}\``, inline: true })
			embed.addFields({ name: `**🆙 Upvotes:**`, value: `\`${result ? result.voteCounter : 0}\``, inline: true })
			//embed.setTimestamp()
			//embed.setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true}) || message.user.defaultAvatarURL })
		return message.alphaReply({ embeds: [embed] })
    }
}