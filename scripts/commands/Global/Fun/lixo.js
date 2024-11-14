const { MessageAttachment } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para fazer a imagem',
                type: 6
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['lixo', 'trash'];
        this.helpen = 'Create a meme saying something is garbage';
        this.help = 'Crie um meme falando que algo é lixo';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985952388168945684/unknown.png'
        this.howToUsePT = '<usuário/id de usuário/imagem>'
        this.howToUseEN = '<user/userID/image>'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)
        let image = null
        message.attachments.forEach((a) => image = a.proxyURL)

        let img = image || user.avatarURL({ format: "png", size: 2048 }) || user.defaultAvatarURL

        let trashImage = await this.canvasImages.trash(img).catch(() => null);

        let attachment = new MessageAttachment(trashImage, `${user.tag || message.user.tag}-trash.png`);
        return message.alphaReply({ files: [attachment] });
    }
}