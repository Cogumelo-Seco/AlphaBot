const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'lang',
                description: 'Escolha a linguagem',
                required: true,
                type: 3,
                choices: [
                    {
                      name: 'PT-BR',
                      value: 'pt',
                    },
                    {
                        name: 'EN',
                        value: 'en',
                    }
                ]
            }
        ];
        this.permissionLevel = 3
		this.clientPermissionLevel = [26]
        this.name = ['language', 'linguagem', 'lang'];
        this.helpen = 'Change the bot language';
        this.help = 'Altere a linguagem do bot';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985583300838064128/unknown.png'
        this.howToUsePT = '<linguagem>'
        this.howToUseEN = '<language>'
    }

    async run(message) {
        let lang = this.args[0] ? this.args[0].toLowerCase() : null
        const result = await this.client.schemas['serv'].findById(message.guild.id)

        if (lang == 'pt') {
            result.language = 'pt'
            await result.save()

            let embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription('**Linguagem alterada para \`Português\`**')
            return message.alphaReply({ embeds: [embed] })
        } else if (lang == 'en') {
            result.language = 'en'
            await result.save()

            let embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription('**Language changed to \`English\`**')
            return message.alphaReply({ embeds: [embed] })
        } else {
            let embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(this.structure.language.embed_description)
            return message.alphaReply({ embeds: [embed] })
        }
    }
}
