const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'arg',
                description: 'Adicione uma pergunta (Você pode adicionar | para que o bot faça uma escolha de opções)',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26, 22]
        this.name = ['pergunta', '8ball'];
        this.helpen = 'Ask the bot a question and he will answer you';
        this.help = 'Faça uma pergunta para o bot e ele lhe responderá';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985581983289729094/unknown.png'
        this.howToUsePT = '<uma pergunta/escolha separada por "|">'
        this.howToUseEN = '<a question/choice separated by "|">'
    }

    async run(message) {
        const question = this.args.join(" ");
        const text = this.args ? this.args.slice(0).join(' ').split('|') : null
        const embed = new MessageEmbed()

        if (!question) {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.structure.ball.embed_description)
            return message.alphaReplyError({ embeds: [embed] });
        }

        if (text.length > 1) {
            let rand = text[Math.floor(Math.random() * text.length)];
            embed
                .setColor(this.config.botColor1)
                .setDescription(`${this.structure.ball.comment} \`${rand}\``)
                .setFooter({ text: `${this.structure.ball.question} "${question}"` })
            return message.alphaReply({ embeds: [embed] })
        }

        let list = this.structure.ball.list
        let rand = list[Math.floor(Math.random() * list.length)];

        embed
            .setColor(this.config.botColor1)
            .setDescription(`**${rand}**`)
            .setFooter({ text: `${this.structure.ball.question} "${question}"` })
        return message.alphaReply({ embeds: [embed] })
    }
}