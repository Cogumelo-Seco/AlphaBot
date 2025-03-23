const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.permissionLevel = 1
        this.name = ['cl', 'cc'];
        this.help = 'Limpa o console do bot'
    }

    async run(message) {
        try {
            console.clear();
            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription(`**Console limpo!**`)
            message.alphaReply({ embeds: [embed] });
            return this.console.custom('bgGreen', false, 'Console limpo!!')
        } catch (err) {
            return this.console.error(err);
        }
    }
}