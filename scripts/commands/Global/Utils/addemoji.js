const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'nome',
                description: 'Adicione um nome para o emoji',
                required: true,
                type: 3
            },
            {
                name: 'link',
                description: 'Adicione uma imagem para o emoji',
                required: true,
                type: 11
            }
        ];
        this.permissionLevel = 11
		this.clientPermissionLevel = [26, 11]
        this.name = ['addemoji', 'adcemoji', 'adicionaremoji'];
        this.helpen = 'Add an emoji on the server';
        this.help = 'Adicione um emoji no servidor';

        this.howToUsePT = '<imagem> [nome do emoji]'
        this.howToUseEN = '<image> [emoji name]'
    }

    async run(message) {
        const embed = new MessageEmbed()
        let name = this.args.join('-') || 'Alpha_Emoji_'+(await message.guild.emojis.fetch()).size
        let image = null
        message.attachments.forEach((a) => image = a.proxyURL)

        if (!image) return message.alphaReplyError(this.structure.addemoji.noImage)

        let result = await message.guild.emojis.create(image, name).catch(e => {
            return message.guild.emojis.create(image, 'alpha_e').catch(err => err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack)
        })

        if (typeof result == 'object') {
            embed
                .setColor(this.config.botColor1)
                .setDescription(this.structure.addemoji.success)
            return message.alphaReply({ embeds: [embed] })
        } else {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.structure.addemoji.error.replace('{{error}}', result))
            return message.alphaReplyError({ embeds: [embed] })
        }
    }
}
