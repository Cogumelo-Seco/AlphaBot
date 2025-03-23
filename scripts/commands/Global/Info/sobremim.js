const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'sobre',
                description: 'Adicione uma descição para seu perfil',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['sobremim', 'aboutme'];
        this.helpen = 'Change your profile about me';
        this.help = 'Altera o sobremim do seu perfil';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985583077776568330/unknown.png'
        this.howToUsePT = '<mensagem>'
        this.howToUseEN = '<message>'
    }

    async run(message) {
        const txt = this.args.slice(0).join(' ');
        const result = await this.client.schemas['user'].findById(message.user.id);
        const embed = new MessageEmbed()

        if(!txt) return message.alphaReplyError(this.structure.sobremim.embed_description)

        if (txt.length > 150) return message.alphaReplyError(this.structure.sobremim.embed2_description)

        if (!result) {
            embed 
                .setColor(this.config.botColor2)
                .setDescription(this.events.dbs.noauthor)
            return message.alphaReply({ embeds: [embed] })
        }

        result.aboutme = txt
        await result.save();
        
        embed
            .setColor(result.color || this.config.botColor1)
            .setDescription(`${this.structure.sobremim.embed3_description} \`${txt}\``)
        return message.alphaReply({ embeds: [embed] })
    }
}