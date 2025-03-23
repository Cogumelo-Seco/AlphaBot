const { MessageAttachment } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para adicionar o filtro ao avatar',
                type: 6
            },
            {
                name: 'arg',
                description: 'Adicione um argumento para adicionar no lugar da frase WASTED',
                type: 3
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['wasted'];
        this.helpen = 'Add a filter with the caption WASTED from GTA V';
        this.help = 'Adicione um filtro com a legenda WASTED do GTA V';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985581408137396244/unknown.png'
        this.howToUsePT = '<usuário/id de usuário/imagem> [mensagem]'
        this.howToUseEN = '<user/userID/image> [message]'
    }

    async run(message) {
        let clientUser = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)

        let text = null
        let imageURL = null

        if (!clientUser) {
            imageURL = message.user.avatar ? message.user.avatarURL({ format: "png", size: 2048 }) : message.user.defaultAvatarURL
            text = this.args[0] ? this.args.join(' ') : 'wasted'
        } else {
            imageURL = clientUser.avatar ? clientUser.avatarURL({ format: "png", size: 2048 }) : message.user.defaultAvatarURL
            text = this.args[1] ? this.args.splice(1).join(' ') : 'wasted'
        }

        let canvas = await this.canvasFilters.wastedFilter(this.client, imageURL, text, message)
        if (!canvas) canvas = await this.canvasFilters.wastedFilter(this.client, message.user.avatarURL({ format: "png", size: 2048 }), text, message)

        let attachment = new MessageAttachment(canvas, `${clientUser ? clientUser.tag : null || message.user.username}-wasted.png`);
        return message.alphaReply({ files: [attachment] });
    }
}