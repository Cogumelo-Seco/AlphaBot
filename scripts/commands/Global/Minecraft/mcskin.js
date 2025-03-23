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
        this.name = ['mcskin', 'minecraftskin'];
        this.helpen = 'Shows the image of a Minecraft skin';
        this.help = 'Mostra a imagem de uma skin de Minecraft';

        this.howToUsePT = '<nome de um usuário minecraft>'
        this.howToUseEN = '<name of a minecraft user>'
    }

    async run(message) {
        const embed = new MessageEmbed()
        const user = this.args.slice(0).join(' ');
        const body = await this.getMcUser(user)

        if (!body) return message.alphaReplyError(this.events.commands.invalidPlayer)

        const id = body.id
        const name = body.name

        const url = `https://crafatar.com/skins/${id}`
        const download = `https://mc-heads.net/download/${id}`

        embed
            .setColor(this.config.botColor1)
            .setDescription((this.structure.mcskin.embed_description).replace('{{user}}', name).replace('{{download}}', download))
            .setImage(url)
        return message.alphaReply({ embeds: [embed] })
    }
}

