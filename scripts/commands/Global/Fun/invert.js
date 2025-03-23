const { MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            /*{
                name: 'imagem',
                description: 'Adicione uma imagem',
                type: 11
            },*/
            {
                name: 'usuário',
                description: 'Adicione um usuário',
                type: 6
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['invert', 'inverter'];
        this.helpen = 'Invert the colors of an image';
        this.help = 'Inverta as cores de uma imagem';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985577854010003466/unknown.png'
        this.howToUsePT = '<usuário/id de usuário/imagem>'
        this.howToUseEN = '<user/userID/image>'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)
        let image = null
        message.attachments.forEach((a) => image = a.proxyURL)

        let img = image || user.avatarURL({ format: "png", size: 2048 }) || user.defaultAvatarURL

        const canvas = Canvas.createCanvas(720, 720);
        const ctx = canvas.getContext('2d');

        let background = await Canvas.loadImage(img)
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        if (!this.config.owners.includes(message.user.id)) await this.canvasFilters.watermark(this.client, ctx, canvas)
        this.canvasFilters.invert(ctx, canvas)

        let attachment = new MessageAttachment(canvas.toBuffer(), `${user.tag || message.user.tag}-invert.png`);
        return message.alphaReply({ files: [attachment] });
    }
}