const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'título',
                description: 'Adicione um título para a conquista',
                required: true,
                type: 3
            },
            {
                name: 'arg',
                description: 'Adicione um argumento para a conquista',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['mcachievement', 'minecraftachievement', 'mcadvancement', 'mcprogresso', 'mcconquista'];
        this.helpen = 'Create a custom achievement';
        this.help = 'Cria uma conquista personalizada';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/984944849574842398/unknown.png'
        this.howToUsePT = '<mensagem>'
        this.howToUseEN = '<message>'
    }

    async run(message) {
        let title = this.args.join(' ').split('|')[1] ? this.args.join(' ').split('|')[0] : this.structure.type == 'pt-BR' ? 'Conquista realizada!' : 'Achievement unlocked!';//text ? text[1] : null
        let achievement = this.args.join(' ').split('|')[1] ? this.args.join(' ').split('|')[1] : this.args.join(' ')

        if (this.slashCommand) {
            title = this.args[0]
            achievement = this.args[1]
        }

        const embed = new MessageEmbed()
        
        if (!achievement) {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.structure.mcachievement.embed_description)
            return message.alphaReply({ embeds: [embed] })
        }

        const random = Math.floor(Math.random() * 39);
        const URL = `https://minecraftskinstealer.com/achievement/${random}/${title.replace(/\s+/g, '%20').replace(/[/]/g, '.')}/${achievement.replace(/\s+/g, '%20').replace(/[/]/g, '.')}`;
        embed
            .setColor(this.config.botColor1)
            .setImage(URL)
        if (!this.slashCommand) embed.setFooter({ text: this.structure.mcachievement.info })
        return message.alphaReply({ embeds: [embed] })
    }
}