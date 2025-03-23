const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione id de usuário',
                required: true,
                type: 3
            }
        ];
        this.permissionLevel = 7
		this.clientPermissionLevel = [26, 7]
        this.name = ['baninfo', 'checkban', 'infoban'];
        this.helpen = 'Check out the user\'s ban information';
        this.help = 'Veja o banimento do usuário';

        this.howToUsePT = '<usuário/id de usuário>'
        this.howToUseEN = '<user/userID>'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/<@!>/g, '') : null).catch(() => null)
        let userID = user ? user.id : null

        let ban = await message.guild.bans.fetch(userID).catch(() => null)

		if (!ban || !ban.user) return message.alphaReplyError(`**${this.structure.baninfo.nofind} \`${userID}\`**`)

		let avatar = ban.user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || ban.user.defaultAvatarURL

		const embed = new MessageEmbed()
			.setColor(this.config.botColor1)
			.setThumbnail(avatar)
			.setTitle(this.structure.baninfo.embed_title)
			.setDescription(this.structure.baninfo.embed_description+'✅')
			.addField(this.structure.baninfo.embed_field, `\`${ban.user.tag}\``)
			.addField(this.structure.baninfo.embed_field2, `\`${ban.reason ? ban.reason : '🤷'}\``)
			.setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({format:  "png", dynamic: true}) || message.user.defaultAvatarURL })

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('unban')
					.setEmoji('✅')
					.setStyle('SUCCESS')
			)
			
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
		
			if (i.customId == 'unban') {
				message.guild.members.unban(userID).then(() => {
					const newEmbed = new MessageEmbed()
						.setColor(this.config.botColor1)
						.setDescription((this.structure.baninfo.embed2_description).replace('{{user}}', ban.user.tag))
					return msg.edit({ embeds: [newEmbed], components: [] }).catch(() => null)
				}).catch(() => {
					const newEmbed = new MessageEmbed()
						.setColor(this.config.botColor2)
						.setDescription(`${this.structure.baninfo.embed3_description} \`${ban.user.tag}\``)
					return msg.edit({ embeds: [newEmbed], components: [] }).catch(() => null)
				})
			}
		})
    }
}
