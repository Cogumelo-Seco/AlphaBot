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
            },
            {
                name: 'razão',
                description: 'Adicione uma razão',
                type: 3
            }
        ];
        this.permissionLevel = 8
		this.clientPermissionLevel = [26, 8]
        this.name = ['kick'];
        this.helpen = 'Kicks someone off the server';
        this.help = 'Expulsa alguém do servidor';

        this.howToUsePT = '<usuário/id de usuário> [razão]'
        this.howToUseEN = '<user/userID> [reason]'
    }

    async run(message) {
        let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)

        if (!user || !user.id) return message.alphaReplyError(this.events.commands.noidofmetion);

        if (user.id === message.user.id) return message.alphaReplyError(this.structure.kick.embed_description)

        let reason = this.args.slice(1).join(' ');
        if (!reason && this.structure.type == 'pt-BR') reason = 'indefinido';
        
        if (!user.kickable) return message.alphaReplyError(`${this.structure.kick.embed2_description} ${user}`)

        const embeduser = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription((this.structure.kick.embedkickdm_description).replace('{{author}}', message.user.tag).replace('{{guild}}', message.guild.name).replace('{{reason}}', reason))
        user.send({ embeds: [embeduser] }).catch(() => null)

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription((this.structure.kick.embedkick_description).replace('{{author}}', message.user).replace('{{user}}', user).replace('{{reason}}', reason))
        await message.alphaReply({ embeds: [embed] });
        
        return user.kick(reason)
    }
}
