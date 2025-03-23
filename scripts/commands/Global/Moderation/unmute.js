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
                type: 6
            }
        ];
        this.permissionLevel = 8
		this.clientPermissionLevel = [26, 12]
        this.name = [ 'unmute', 'untimeout' ];
        this.helpen = 'Unmute someone from the server';
        this.help = 'Retira o silenciamento de alguém do servidor';

        this.howToUsePT = '<usuário/id de usuário>'
        this.howToUseEN = '<user/userID>'
    }

    async run(message) {
        let member = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)

        if (!member) return message.alphaReplyError(this.events.commands.noidofmetion);
        if (!member.communicationDisabledUntilTimestamp) return message.alphaReplyError(this.structure.unmute.nopunished)

        member.timeout(0)
            .then(() => {
                const embeduser = new MessageEmbed()
                    .setColor(this.config.botColor1)
                    .setDescription((this.structure.unmute.embedunmutedm_description).replace('{{guild}}', message.guild.name).replace('{{author}}', message.user.tag))
                member.send({ embeds: [embeduser] }).then().catch(() => null)
        
                const embed = new MessageEmbed()
                    .setColor(this.config.botColor1)
                    .setDescription((this.structure.unmute.embedunmute_description).replace('{{author}}', message.user).replace('{{user}}', member))
                message.alphaReply({ embeds: [embed] });
            })
            .catch(() => message.alphaReplyError(`${this.structure.unmute.embed_description} ${user}`))
    }
}
