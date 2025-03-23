const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para ver o saldo dele',
                type: 6
            }
        ];
        this.name = ['banco', 'bank', 'bal'];
        this.helpen = 'See your bank balance or someone else\'s';
        this.help = 'Veja o seu saldo no banco ou o de alguém';

        this.howToUsePT = '[usuário/id de usuário]'
        this.howToUseEN = '[user/userID]'
    }

    async run(message) {
        let clientUsers = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)
        let user = clientUsers || message.user;

        const result = await this.client.schemas['user'].findById(user.id);


        const embed = new MessageEmbed()
            .setColor(result ? result.color || this.config.botColor1 : this.config.botColor1)
            .setAuthor({ name: `${this.structure.bal.embed_author} ${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setDescription((this.structure.bal.embed2_description).replace('{{user}}', user).replace('{{diamonds}}', result ? result.diamonds : 0).replace('{{bank}}', result ? result.bank : 0).replace('{{dirty}}', result ? result.alphaCoins : 0).replace('{{stone}}', result ? result.magicstones : 0))
            .setThumbnail(user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || user.defaultAvatarURL)
            .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true }) || message.user.defaultAvatarURL })
        return message.alphaReply({ embeds: [embed] })
    }
}
