const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'moeda1',
                description: 'Escolha um tipo de moeda',
                type: 3,
                autocomplete: true
            },
            {
                name: 'moeda2',
                description: 'Escolha um tipo de moeda',
                type: 3,
                autocomplete: true
            },
            {
                name: 'quanidade',
                description: 'Escolha uma quantidade',
                type: 3,
                autocomplete: true
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['money', 'moeda'];
        this.helpen = 'Find out a currency quote';
        this.help = 'Saiba a cotação de uma moeda';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985584296842629180/unknown.png'
        this.howToUsePT = '<moéda1> <moéda2>'
        this.howToUseEN = '<currency1> <currency2>'
    }

    async run(message) {
        let val1 = this.args[0] ? this.args[0].replace(/[^a-zA-Z]/g, '').toUpperCase() : null
        let val2 = this.args[1] ? this.args[1].replace(/[^a-zA-Z]/g, '').toUpperCase() : null
        let val3 = this.args[2] || 1
        if (val3 != Number(val3) || val3 > 1000000000) val3 = 1

        let coins = ''
        
        let href = await request.get(`https://economia.awesomeapi.com.br/all/${val1}-${val2}`).catch(() => null)
        let { body } = await request.get(`https://economia.awesomeapi.com.br/all`)

        for (var i in body) {
            if (body.hasOwnProperty(i)) {
                coins += "|" + i 
            }
        }

        const embed = new MessageEmbed()

        if (href) {
            let result = (Number(href.body[val1].low)+Number(href.body[val1].high))/2
            let total = (result*val3).toFixed(4)

            embed
                .setColor(this.config.botColor1)
                .setDescription(`🪙 **${val3} ${val1}** ${this.structure.money.to} **${val2}**: \`${total} ${val2}\``)
            return message.alphaReply({ embeds: [embed] })
        } else {
            embed
                .setColor(this.config.botColor2)
                .setDescription((this.structure.money.embed_description).replace('{{coin}}', coins))
            return message.alphaReply({ embeds: [embed] })
        }
    }

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const options = interaction.options._hoistedOptions

        if (focusedOption.name == 'quanidade') {
            let href = await request.get(`https://economia.awesomeapi.com.br/all/${options[0].value}-${options[1].value}`).catch(() => null)
            let result = href ? (Number(href.body[options[0].value].low)+Number(href.body[options[0].value].high))/2 : NaN
            let total = (result*Number(focusedOption.value)).toFixed(4)

            interaction.respond([{ name: String(total), value: focusedOption.value }])
        } else {
            const { body } = await request.get(`https://economia.awesomeapi.com.br/all`)
            let coins = Object.keys(body)
            coins.push('BRL')

            interaction.respond(coins.filter(m => m.includes(focusedOption.value.toUpperCase())).splice(0, 25).map(m => { return { name: m, value: m } }))
        }
    }
}
