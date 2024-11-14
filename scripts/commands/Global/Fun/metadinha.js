const { MessageAttachment, MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário1',
                description: 'Adicione um usuário',
                type: 6,
                required: true,
            },
            {
                name: 'usuário2',
                description: 'Adicione um usuário',
                type: 6,
                required: true,
            },
            {
                name: 'usuário3',
                description: 'Adicione um usuário',
                type: 6,
            },
            {
                name: 'usuário4',
                description: 'Adicione um usuário',
                type: 6,
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['metadinha']
        this.helpen = 'Gather avatars';
        this.help = 'Junte avatares para ver a metadinha';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/975558105377157130/unknown.png'
        this.howToUsePT = '<usuário 1> <usuário 2> [usuário 3] [usuário 4]'
        this.howToUseEN = '<user 1> <user 2> [user 3] [user 4]'
    }

    async run(message) {
        let users = []
        let names = ''

        for (let i in this.args) {
            let user = await this.client.users.fetch(this.args[i].replace(/[<!>]/g, '')).catch(() => null)
            if (user && Number(i) < 4) {
                names += `${user.username}${Number(i) != this.args.length-1 && Number(i) != 3 ? ', ' : ''}`
                users[i] = user
            }
        }

        if (!users[0] || !users[1]) return message.alphaReplyError(this.structure.metadinha.nousers)

        message.defer()

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setImage(`attachment://metadinha.png`)
            .setTitle(`Metadinha: ${names}`)

        let canvas = await this.canvasImages.metadinha(users)

        let attachment = new MessageAttachment(canvas, `metadinha.png`);
        return message.alphaReply({ embeds: [embed], files: [attachment] });
    }
}
