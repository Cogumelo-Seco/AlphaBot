const { MessageEmbed } = require('discord.js');

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    run(props) {
        let commandName = props[0]
        
        let command = this.client.commands[commandName]
        if (!command) return null
        command = new (command.class)
        const embed = new MessageEmbed()
            .setTitle(commandName.split('')[0].toUpperCase() + commandName.split('').slice(1).join(''))
            .setColor(this.config.botColor2)

        let commandArguments = ''
        for (let i in command.arguments)
            commandArguments += `⠀\`${command.arguments[i].argument}\`: ${command.arguments[i][this.structure.type == 'en' ? 'descriptionEN' : 'descriptionPT']}${i != command.arguments.length-1 ? ';\n' : '.'}`

        let commandSynonyms = ''
        for (let i in command.name)
            commandSynonyms += `\`${command.name[i]}\`${i >= command.name.length-1 ? '' : ','} `

        let description = this.structure.type == 'en' ? command.helpen : command.help
        if (command.additionalDescription) description += `\n\n${command.additionalDescription[this.structure.type == 'en' ? 'EN' : 'PT']}`
        description += `\n\n**${this.events.commands.howToUse}:** \`${commandName}${command.howToUsePT ? this.structure.type == 'en' ? ` ${command.howToUseEN}` : ` ${command.howToUsePT}` : ''}\`\n`
        if (command.arguments) description += `\n**${this.events.commands.arguments}:**\n${commandArguments}`
        
        description += `\n**${this.events.commands.synonyms}:\n${commandSynonyms}**\n`

        description += `\n${this.events.commands.helpInformation}`
        if (command.usageExample) {
            description += `\n\n**${this.events.commands.usageExample}:**`
            embed.setImage(command.usageExample)
        }
        embed.setDescription(description)
        return embed;
    }
}