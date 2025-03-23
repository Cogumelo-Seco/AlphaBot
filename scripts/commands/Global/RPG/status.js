const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para ver as informações dele',
                type: 6
            }
        ];
        this.clientPermissionLevel = [26]
        this.name = ['status'];
        this.help = 'Veja suas informações no RPG, ou o de outra pessoa';
        this.helpen = 'See your information in RPG, or someone else\'s';
        this.howToUsePT = '[usuário/id de usuário]'
        this.howToUseEN = '[user/userID]'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)

		let player = await this.verifyRPGPlayer(user) 

        let requiredXP = Number.parseInt(15 * player.level ** 2 + 50 * player.level + 100)
        let percent = Number.parseInt(player.xp/requiredXP*100)
        let attachment = new MessageAttachment(await this.canvasImages.RPGPlayerStatus(player), `img.png`)

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setThumbnail(user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || user.defaultAvatarURL)
            .setImage(`attachment://img.png`)
            .setTitle(this.structure.status.title.replace('{{username}}', user.username))
            .setDescription(this.structure.status.embed
                .replace('{{playerLevel}}', player.level)
                .replace('{{playerXP}}', player.xp)
                .replace('{{requiredXP}}', requiredXP)
                .replace('{{percent}}', percent)
            )
        message.alphaReply({ embeds: [embed], files: [attachment] })
    }
}