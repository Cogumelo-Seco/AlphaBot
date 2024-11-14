const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');
const Badges = require('../../../structures/configs/Badges')

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['badges', 'badgesinfo', 'emblemas'];
        this.helpen = 'Sends information about Discord badges and Alpha specials';
        this.help = 'Envia informações sobre os badges do Discord e especiais do Alpha';
    }

    async run(message) {
        let txt = ''
        for (var i in Badges) {
            i = Number(i)
            if (this.structure.type = 'pt-BR') txt += `${Badges[i].emoji}: ${Badges[i].description}\n`
            else txt += `${Badges[i].emoji}: ${Badges[i].descriptionen}\n`
        }
        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setTitle(this.structure.badges.embed_title)
            .setDescription(txt)
            .setFooter({ text: message.user.tag, iconURL: message.user.avatarURL({ dynamic: true }) || message.user.defaultAvatarURL })
            .setTimestamp()
        return message.alphaReply({ embeds: [embed] })
    }
}