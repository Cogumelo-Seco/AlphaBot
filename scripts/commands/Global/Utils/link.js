const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['convite', 'invite', 'vote', 'support', 'website', 'votar', 'link', 'links'];
        this.helpen = 'Get links related to me';
        this.help = 'Obtenha links relacionados a mim';
    }

    async run(message) {
        let avatar = message.user.avatarURL({ dynamic: true, format: "png" }) || message.user.defaultAvatarURL
    
        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setTitle('🔗 Links')
            .setDescription(this.structure.invite.embed_description)
            .setThumbnail(this.client.user.avatarURL({ dynamic: true, format: "png"}))
            .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: avatar })
        return message.alphaReply({ embeds: [embed] })
    }
}
