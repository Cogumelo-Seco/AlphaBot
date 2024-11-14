const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um nome de usuário Minecraft para ver informações',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['mcuuid', 'minecraftuuid'];
        this.helpen = 'Shows the UUID of a Minecraft player';
        this.help = 'Mostra o UUID de um jogador de Minecraft';

        this.howToUsePT = '<nome de um usuário minecraft>'
        this.howToUseEN = '<name of a minecraft user>'
    }

    async run(message) {
        const embed = new MessageEmbed()
        const user = this.args.slice(0).join(' ');
        const body = await this.getMcUser(user, embed)

        if (!body) return message.alphaReplyError(this.events.commands.invalidPlayer)

        const id = body.id
        const name = body.name

        embed
            .setColor(this.config.botColor1)
            .setDescription((this.structure.mcuuid.embed_description).replace('{{user}}', name).replace('{{uuid}}', id))
        return message.alphaReply({ embeds: [embed] })
    }
}

