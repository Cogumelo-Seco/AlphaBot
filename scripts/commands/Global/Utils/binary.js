const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'tipo',
                description: 'Escolha',
                required: true,
                type: 3,
                choices: [
                    {
                        name: 'Decodificar',
                        value: 'decodificar',
                    },
                    {
                        name: 'Codificar',
                        value: 'codificar',
                    }
                ]
            },
            {
                name: 'arg',
                description: 'Adicione um argumento',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['binary', 'binário', 'binario'];
        this.helpen = 'Convert a binary code to a message or a message to binary code';
        this.help = 'Converta um código binario em uma mensagem ou uma mensagem em código binario';

        this.howToUsePT = '<codificar/decodificar> <mensagem/código binario>'
        this.howToUseEN = '<encode/decode> <message/binary code>'
    }

    async run(message) {
        let txt = this.args.slice(1).join(' ') || null
        let type = this.args[0] ? this.args[0].toLowerCase() : null

        if (txt && type == 'encode' || type == 'codificar') {
            let href = await this.encode(txt)
            let code = href.binary

            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription(`**${this.structure.binary.message}:**\n\`\`\`${txt}\`\`\`\n**${this.structure.binary.code}:**\n\`\`\`${code}\`\`\``)
            return message.alphaReply({ embeds: [embed] })
        } else if (txt && type == 'decode' || type == 'decodificar') {
            let href = await this.decode(txt)
            let msg = href.text

            if (!msg) return message.alphaReplyError('Código inválido')

            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription(`**${this.structure.binary.code}:**\n\`\`\`${txt}\`\`\`\n**${this.structure.binary.message}:**\n\`\`\`${msg}\`\`\``)
            return message.alphaReply({ embeds: [embed] })
        } else {
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setThumbnail(this.client.user.avatarURL({ dynamic: true, format: "png", size: 1024 }))
                .setDescription(this.structure.binary.embed_description)
            return message.alphaReply({ embeds: [embed] })
        }
    }

    async encode(txt) {
        const { body } = await request.get(`https://some-random-api.ml/binary?text=${txt}`)

        if(!body) return null
        return body
    }

    async decode(txt) {
        const { body } = await request.get(`https://some-random-api.ml/binary?decode=${txt}`)

        if(!body) return null
        return body
    }
}

