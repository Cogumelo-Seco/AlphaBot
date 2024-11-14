const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'calculo',
                description: 'Adicione um calculo matemático',
                type: 3,
                autocomplete: true
            }
        ];
		this.clientPermissionLevel = [26, 22]
        this.name = ['calc', 'math'];
        this.helpen = 'Mathematical bot?';
        this.help = 'Faz um calculo';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985582229566685234/unknown.png'
        this.howToUsePT = '[conta matemática]'
        this.howToUseEN = '[math count]'
    }

    async run(message) {
        let calc = this.args.join(" ")
            .replace(/[π]/g, 'PI')
            .replace(/[÷]/g, '/')
            .replace(/[xX]/g, '*')
        const embed = new MessageEmbed()
        let resp;

        try {
            resp = this.client.math.evaluate(calc)
        } catch (error) {
            resp = null
        }

        if (!resp) {
            calc = ''

            const rowButtons1 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('CE')
                        .setLabel('CE')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('C')
                        .setLabel('C')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('^')
                        .setLabel('^')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('%')
                        .setLabel('%')
                        .setStyle('PRIMARY'),
                )
            const rowButtons2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('1')
                        .setLabel('1')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('2')
                        .setLabel('2')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('3')
                        .setLabel('3')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('+')
                        .setLabel('+')
                        .setStyle('PRIMARY'),
                )
            const rowButtons3 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('4')
                        .setLabel('4')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('5')
                        .setLabel('5')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('6')
                        .setLabel('6')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('-')
                        .setLabel('-')
                        .setStyle('PRIMARY'),
                )
            const rowButtons4 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('7')
                        .setLabel('7')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('8')
                        .setLabel('8')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('9')
                        .setLabel('9')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('x')
                        .setLabel('x')
                        .setStyle('PRIMARY'),
                )
            const rowButtons5 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('0')
                        .setLabel('0')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('.')
                        .setLabel('.')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('÷')
                        .setLabel('÷')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('π')
                        .setLabel('π')
                        .setStyle('PRIMARY'),
                )

            embed
                .setColor(this.config.botColor1)
                .setDescription(`**${this.structure.math.question}:**\n\`\`\`${' '.padEnd(30, ' ')}\`\`\`\n\n**${this.structure.math.result}:\`\`\` \`\`\`**`)

            let msg = await message.alphaReply({ embeds: [embed], components: [rowButtons1, rowButtons2, rowButtons3, rowButtons4, rowButtons5] })
            if (!msg) return

            msg.createMessageComponentCollector({ filter: i => i.user.id == message.user.id, time: 60000 })
            .on('end', () => {
                let components = msg.components
                for (let i in components) {
                    for (let a in components[i].components) {
                        if (components[i].components[a].setPlaceholder) components[i].components[a].setPlaceholder(this.events.commands.timeout)
                        components[i].components[a].setDisabled(true)
                    }                
                }
                msg.edit({ components }).catch(() => null)
            })
            .on('collect', async (i) => {
                await i.deferUpdate();

                if (!calc && calc != '') calc = ''
            
                if (i.customId == 'C') {
                    calc = ''
                    this.edit(embed, calc, msg)
                } else if (i.customId == 'CE') {
                    calc = calc.slice(0, calc.length-1)
                    this.edit(embed, calc, msg)
                } else {
                    calc += i.customId
                    this.edit(embed, calc, msg)
                }

                calc.slice(0, 100)
            })
        } else {
            embed
                .setColor(this.config.botColor1)
                .setDescription(`**${this.structure.math.question}:**\n${this.args.join(' ')}\n**${this.structure.math.result}:**\n${resp}`)
                .setThumbnail('https://cdn.discordapp.com/attachments/784557596580904981/793955272597962752/calculator.png')
            return message.alphaReply({ embeds: [embed], components: [] });
        }
    }

    edit(embed, calc, msg) {
        let resp;

        try {
            resp = this.client.math.evaluate(calc
                .replace(/[π]/g, 'PI')
                .replace(/[÷]/g, '/')
                .replace(/[x]/g, '*')
            )
        } catch (error) {
            resp = null
        }

        embed
            .setColor(this.config.botColor1)
            .setDescription(`**${this.structure.math.question}:**\n\`\`\`${(calc.replace(/[π]/g, 'PI') || ' ').padEnd(30, ' ')}\`\`\`\n\n**${this.structure.math.result}:\`\`\`${resp || ' '}\`\`\`**`)
        msg.edit({ embeds: [embed] }).catch(() => null)
    }

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        let resp;

        try {
            resp = this.client.math.evaluate(focusedOption.value
                .replace(/[π]/g, 'PI')
                .replace(/[÷]/g, '/')
                .replace(/[xX]/g, '*')
            )
        } catch (error) {
            resp = null
        }
        
        interaction.respond([{ name: resp ? `= ${resp}` : this.structure.math.wrongExpression, value: focusedOption.value }]);
    }
}