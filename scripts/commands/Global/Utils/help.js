const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'comando',
                description: 'Adicione um comando para ver informações',
                type: 3,
                autocomplete: true
            }
        ];
		this.clientPermissionLevel = [26, 22]
        this.name = ['help', 'ajuda', 'cmd']
        this.helpen = 'Send information about a command';
        this.help = 'Envia informações sobre um comando';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985584026368741406/unknown.png'
        this.howToUsePT = '<comando>'
        this.howToUseEN = '<command>'
    }

    async run(message) {
        const commandInfoEmbed = this.buildHelpMessage(this.args[0])

        if (commandInfoEmbed) {
            commandInfoEmbed
                .setColor(this.config.botColor1)
                .setFooter({ text: this.structure.help.footer })
            return message.alphaReply({ embeds: [commandInfoEmbed] })
        }

        let categories = []
        for (let i in this.client.slashCommands) {
            let category = this.structure.type == 'pt-BR' ? this.events.categories[this.client.slashCommands[i].category] || this.client.slashCommands[i].category : this.client.slashCommands[i].category
            let commandName = this.client.slashCommands[i].commandName
            let info = new this.client.slashCommands[i].class

            let currentCategoryArray = categories.find(c => c.categoryName == category)
            if (!currentCategoryArray) {
                let index = categories.push({ categoryName: category, text: '', numberOfCommands: 0 })
                currentCategoryArray = categories[index-1]
            }

			currentCategoryArray.numberOfCommands += 1
            currentCategoryArray.text += `\`${commandName}:\` ${this.structure.type == 'pt-BR' ? info.help : info.helpen}\n`
        }

        let categoriesText =  String(categories.map(c => c.categoryName)).split(',').join(', ')

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription(this.structure.help.home.replace('{{categoriesText}}', categoriesText))
            .setFooter({ text: this.structure.help.footer })

        let rowCategoriesOptions = []
        for (let i in categories) rowCategoriesOptions.push({
            label: categories[i].categoryName,
            description: String(categories[i].numberOfCommands),
            value: i
        })

        const rowCategoriesMenu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('categoriesMenu')
					.setPlaceholder(this.structure.help.categoriesMenu)
					.addOptions(rowCategoriesOptions),
			);

        let msg = await message.alphaReply({ embeds: [embed], components: [rowCategoriesMenu] })
        if (!msg) return

        msg.createMessageComponentCollector({ filter: i => i.user.id == message.user.id, time: 120000 })
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
            await i.deferUpdate()

            let categoryInfo = categories[Number(i.values)]

            embed
                .setColor(this.config.botColor1)
                .setTitle(`\\ℹ️ ${categoryInfo.categoryName} (${categoryInfo.numberOfCommands})`)
                .setDescription(categoryInfo.text)
            return msg.edit({ embeds: [embed] })
        })
    }

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const commands = (Object.values(this.client.slashCommands).filter(c => String(c.commandNames).includes(focusedOption.value.toLowerCase().replace(/\s/g, ''))).splice(0, 5)).map(c => { return { name: c.commandName, value: c.commandName } })
        if (!commands[0]) commands.push({ name: this.structure.help.noCommand, value: '' })

        interaction.respond(commands);
    }
}
