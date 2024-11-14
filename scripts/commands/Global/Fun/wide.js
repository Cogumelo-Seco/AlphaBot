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
            },
            {
                name: 'valor',
                description: 'Adicione um valor entre 1 a 500 para deixar wide',
                type: 3
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['wide'];
        this.helpen = 'WIDE';
        this.help = 'WIDE';
        this.usageExample = null
        this.howToUsePT = '<usuário/id de usuário/imagem>'
        this.howToUseEN = '<user/userID/image>'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)
        let image = null
        message.attachments.forEach((a) => image = a.proxyURL)

        let imageURL = image || user.avatarURL({ format: "png", size: 2048 }) || user.defaultAvatarURL
        let wideValue = isNaN(Number(this.args[1])) ? isNaN(Number(this.args[0])) ? 50 : Number(this.args[0]) : Number(this.args[1])
        wideValue = wideValue >= 500 ? 500 : wideValue <= 1 ? 1 : wideValue

        const canvasImage = await Canvas.loadImage(imageURL).catch(() => null);
        const canvas = Canvas.createCanvas(canvasImage.width*(wideValue/100*5), canvasImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);

        let attachment = new MessageAttachment(canvas.toBuffer(), `${user.tag || message.user.tag}-wide.png`);
        return message.alphaReply({ files: [attachment] });
    }
}