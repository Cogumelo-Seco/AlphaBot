const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário',
                required: true,
                type: 3
            }
        ];
        this.permissionLevel = 7
		this.clientPermissionLevel = [26, 7]
        this.name = ['unban'];
        this.helpen = 'Remove someone\'s ban from the server';
        this.help = 'Retira o banimento de alguém do servidor';

        this.howToUsePT = '<usuário/id de usuário>'
        this.howToUseEN = '<user/userID>'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)
    
        if (!user) return message.alphaReplyError(this.events.commands.noidofmetion);
    
        if (user.id === message.user.id) return message.alphaReplyError(this.structure.unban.embed2_description)
    
        message.guild.members.unban(user.id).then(() => {
            const embeduser = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription((this.structure.unban.embedunbandm_description).replace('{{guild}}', message.guild.name).replace('{{author}}', message.user.tag))
            user.send({ embeds: [embeduser] }).then().catch(() => null)
    
            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription((this.structure.unban.embedunban_description).replace('{{author}}', message.user).replace('{{user}}', user.tag))
            return message.alphaReply({ embeds: [embed] });
        }).catch(() => {
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(`${this.structure.unban.embed3_description} \`${this.args[0].replace(/[<@!>]/g, '')}\``)
            return message.alphaReply({ embeds: [embed] });
        })
    }
}
