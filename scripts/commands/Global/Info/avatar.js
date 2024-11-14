const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para ver o avatar',
                type: 6
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['avatar'];
        this.helpen = 'Send your avatar or someone else\'s image';
        this.help = 'Enviar a imagem do seu avatar ou de alguém';

        this.howToUsePT = '[usuário/id de usuário]'
        this.howToUseEN = '[user/userID]'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)
        let avatar = user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || user.defaultAvatarURL

        const result = await this.client.schemas['user'].findById(user.id)

        let embed = new MessageEmbed() 
            .setColor(result ? result.color : this.config.botColor1)
            .setDescription(`**🖼️ [${this.structure.avatar.embed_title} ${user.username}](<${avatar}>)**`)
            .setImage(avatar) 
        return message.alphaReply({ embeds: [embed] }); 
    }
}