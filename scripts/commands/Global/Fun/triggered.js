const { MessageAttachment } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para fazer um gif triggered',
                type: 6
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['triggered', 'irritado'];
        this.helpen = 'Create an image of someone triggered';
        this.help = 'Crie uma imagem de alguém irritado';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985580808649719869/unknown.png'
        this.howToUsePT = '<usuário/id de usuário/imagem>'
        this.howToUseEN = '<user/userID/image>'
    }

    async run(message) {
		message.defer().then(async() => {
	        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)
	        let image = null
	        message.attachments.forEach((a) => image = a.proxyURL)
	
	        let img = image || user.avatarURL({ format: "png", size: 2048 }) || user.defaultAvatarURL
	        
	        let triggeredImage = await this.canvasImages.triggered(img).catch(() => null);
	
	        let attachment = new MessageAttachment(triggeredImage, `${user.tag || message.user.tag}-Triggered.gif`);
	        return message.alphaReply({ files: [attachment] });
		})
    }
}