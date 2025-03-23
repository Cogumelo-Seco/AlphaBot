const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'cor',
                description: 'Adicione uma cor',
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['cor', 'color'];
        this.helpen = 'Change the color of your profile, userinfo, bank, avatar, rank...';
        this.help = 'Mude a cor do seu perfil, userinfo, banco, avatar, rank...';

        this.howToUsePT = '<cor>'
        this.howToUseEN = '<color>'
    }

    async run(message) {
        const color = this.args[0]

        const result = await this.client.schemas['user'].findById(message.user.id);

        if (!result) {
            embed 
                .setColor(this.config.botColor2)
                .setDescription(this.events.dbs.noauthor)
            return message.alphaReply({ embeds: [embed] })
        }

        if (!color){
            const embed = new MessageEmbed()
                .setColor(result.color || this.config.botColor1)
                .setTitle(this.structure.color.embed_title)
                .setThumbnail(this.client.user.avatarURL({ dynamic: true, format: "png", size: 1024 }))
                .setDescription((this.structure.color.embed_description).replace('{{color}}', this.config.botColor1))
            return message.alphaReply({ embeds: [embed] })
        };

        if (result.diamonds < 1000) return message.alphaReplyError(this.structure.color.embed2_description)

        if (color.length < 3 || color.length > 10) return message.alphaReplyError(`\`${color}\` ${this.structure.color.embed3_description}`)

        let total = result.diamonds - 1000
        result.diamonds = total
        result.color = color
        result.save();

        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`**${this.structure.color.embed4_description} \`${color}\`!!**`)
        return message.alphaReply({ embeds: [embed] })
    }
}