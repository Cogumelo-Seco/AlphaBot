const { MessageAttachment, MessageEmbed } = require('discord.js');
const { join } = require('path');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'categoria',
                description: 'Escolha uma categoria para o filtro',
                type: 3,
                required: true,
                choices: [
                    {
                      name: '🌈 | Trans',
                      value: 'trans',
                    },
                    {
                        name: '🌈 | Rainbow',
                        value: 'rainbow',
                    },
                    {
                        name: '🌈 | Polysexual',
                        value: 'polysexual',
                    },
                    {
                        name: '🌈 | Pan',
                        value: 'pan',
                    },
                    {
                        name: '🌈 | Bi',
                        value: 'bi',
                    },
                    {
                        name: '🌈 | Asexual',
                        value: 'asexual',
                    }
                ]
            },
            {
                name: 'usuário',
                description: 'Adicione um usuário para adicionar o filtro no avatar',
                type: 6
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['gay', 'lgbt', 'lgbtq']
        this.helpen = 'Add a filter with an LGBT flag to an image';
        this.help = 'Adicione um filtro com uma bandeira LGBT em uma imagem';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985578080254951524/unknown.png'
        this.howToUsePT = '<categoria> [usuário/id de usuário/imagem(link)]'
        this.howToUseEN = '<category> [<user/userID/image(link)]'
    }

    async run(message) {
        let clientUsers = await this.client.users.fetch(this.args[1] ? this.args[1].replace(/[<@!>]/g, '') : null).then().catch(() => null)
        let img = this.args[1];
        let user = clientUsers || img || message.user;

        let url = user.avatar ? user.avatarURL({ format: "png", size: 2048 }) : img;
        
        if (!url) url = this.randomAvatar()

        let background = url;
        let image = null

        if (this.args[0] ? this.args[0].toLowerCase() == 'trans' : null)
            image = join(__dirname, '..', '..', '..', `structures/functions/canvas/images/filters/trans.png`);
        else if (this.args[0] ? this.args[0].toLowerCase() == 'rainbow' : null)
            image = join(__dirname, '..', '..', '..', `structures/functions/canvas/images/filters/rainbow.png`);
        else if (this.args[0] ? this.args[0].toLowerCase() == 'polysexual' : null)
            image = join(__dirname, '..', '..', '..', `structures/functions/canvas/images/filters/polysexual.png`);
        else if (this.args[0] ? this.args[0].toLowerCase() == 'pan' : null)
            image = join(__dirname, '..', '..', '..', `structures/functions/canvas/images/filters/pan.png`);
        else if (this.args[0] ? this.args[0].toLowerCase() == 'bi' : null)
            image = join(__dirname, '..', '..', '..', `structures/functions/canvas/images/filters/bi.png`);
        else if (this.args[0] ? this.args[0].toLowerCase() == 'asexual' : null)
            image = join(__dirname, '..', '..', '..', `structures/functions/canvas/images/filters/asexual.png`);
        else {
            let embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(this.structure.lgbt.embed_description)
            return message.alphaReply({ embeds: [embed] })
        }

        let canvas = await this.canvasFilters.imageFilter(this.client, image, background, message)
        if (!canvas) await this.canvasFilters.imageFilter(this.client, image, message.user.avatarURL({ format: "png", size: 2048 }), message)

        let attachment = new MessageAttachment(canvas, `${user.tag || message.user.tag}-lgbt.png`);
        return message.alphaReply('**<:gay:838178191025635329>**', { files: [attachment] });
    }
}
