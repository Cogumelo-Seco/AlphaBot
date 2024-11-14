const { MessageAttachment } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário',
                required: true,
                type: 6
            },
            {
                name: 'arg',
                description: 'Adicione um argumento para adicionar no comentário',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['youtubecomment', 'ytcomment', 'youtubecomentario', 'ytcomentario'];
        this.helpen = 'Make an image of someone\'s YT comment';
        this.help = 'Faça uma imagem de um comentario do YT de alguém';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985581601402540032/unknown.png'
        this.howToUsePT = '<usuário/id de usuário> <mensagem>'
        this.howToUseEN = '<user/userID> <message>'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)
        if (!user) return message.alphaReplyError(this.events.commands.noidofmetion)

        let url = user.avatar ? user.avatarURL({ dynamic: true, format: "png" }) : user.defaultAvatarURL
        let username = user.username.replace(/[^A-Za-z0-9.,;:´`^~"'+\-=%$&*#@!-°º()?/áéíóúãõâêîôûçàèìòù\s]/g, '')
        let comment = this.args[1] ? this.args.splice(1).join(' ').replace(/[^A-Za-z0-9.,;:´`^~"'+\-=%$&*#@!-°º()?/áéíóúãõâêîôûçàèìòù\s]/g, '') : null

        if (!comment) return message.alphaReplyError(this.structure.ytcomment.nocomment)
        if (comment.length > 150) return message.alphaReplyError(this.structure.ytcomment.limit)

        let image = `https://some-random-api.ml/canvas/youtube-comment?avatar=${url}&username=${username}&comment=${comment}`

        let attachment = new MessageAttachment(image, `${user.tag || message.user.tag}-ytcomment.png`);
        return message.alphaReply({ files: [attachment] });
    }
}