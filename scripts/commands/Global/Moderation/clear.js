const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'quantidade',
                description: 'Adicione uma quantidade',
                required: true,
                type: 3
            }
        ];
        this.permissionLevel = 4
		this.clientPermissionLevel = [26, 4]
        this.name = ['limpar', 'clear'];
        this.helpen = 'Clears a certain amount of chat messages';
        this.help = 'Limpa determinada quantia de mensagens do chat';

        this.howToUsePT = '<número de mensagens>'
        this.howToUseEN = '<number of messages>'
    }

    async run(message) {
        const deleteCount = parseInt(this.args[0], 10);

        if (!deleteCount || deleteCount < 1 || deleteCount > 101){
            const embed = new MessageEmbed()
                .setColor(this.config.colorerr)
                .setDescription(this.structure.clear.embed_description)
            return message.alphaReply({ embeds: [embed] })
        }

        if (!message.delete) {
            message.alphaReply('Loading...').then((msg) => {
                msg.delete().then(() => this.clear(message, deleteCount)).catch(() => null)
            })            
        }
        else message.delete().then(() => this.clear(message, deleteCount))
    }

    async clear(message, deleteCount) {
        const messages = await message.channel.messages.fetch({ limit: deleteCount }).catch(() => message.channel.send(`${message.user} **Erro:** \`\`\`js\n${err}\`\`\``))

        message.channel.bulkDelete(messages)
            .catch(err => message.alphaReply(`**Erro:** \`\`\`js\n${err}\`\`\``) );

        return message.channel.send(`**${messages.size} ${this.structure.clear.embed2_description} ${message.user}**`)
            .then(msg => setTimeout(() => msg.delete(), 5000))
            .catch(err => message.channel.send(`${message.user} **Erro:** \`\`\`js\n${err}\`\`\``) );
    }
}
