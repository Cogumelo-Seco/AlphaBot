const ms = require('ms');
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
                name: 'tempo',
                description: 'Adicione um tempo',
                required: true,
                type: 3
            },
            {
                name: 'razão',
                description: 'Adicione uma razão',
                type: 3
            }
        ];
        this.permissionLevel = 8
		this.clientPermissionLevel = [26, 12]
        this.name = [ 'mute', 'timeout' ];
        this.helpen = 'Mute a person on the server, by Timeout';
        this.help = 'Muta uma pessoa no servidor, por Timeout';

        this.howToUsePT = '<usuário/id de usuário> <tempo> [razão]'
        this.howToUseEN = '<user/userID> <time> [reason]'
    }

    async run(message) {
        let reason = this.args.slice(2).join(' ');
        if (!reason && this.structure.type == 'pt-BR') reason = 'indefinido';

        let member = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null);

        if (!member || !member.id) return message.alphaReplyError(this.events.commands.noidofmetion);
        if (member.id === message.user.id) return message.alphaReplyError(this.structure.mute.embed_description)
        if (!this.args[1]) return message.alphaReplyError(this.structure.mute.embed3_description)

        let time = ms(this.args[1]);

        if (!time) return message.alphaReplyError(this.structure.mute.embed3_description);
        if (time < 1000 || time > 2419200000) return message.alphaReplyError(this.structure.mute.invalidTime)

        member.timeout(time, reason)
            .then(() => {
                const embeduser = new MessageEmbed()
                    .setColor(this.config.botColor1)
                    .setDescription((this.structure.mute.embedmutedm_description).replace('{{guild}}', message.guild.name).replace('{{author}}', message.user.tag).replace('{{reason}}', reason).replace('{{args[1]}}', this.args[1]))
                member.send(embeduser).catch(() => null)

                const embed = new MessageEmbed()
                    .setColor(this.config.botColor1)
                    .setDescription((this.structure.mute.embedmute_description).replace('{{author}}', message.user).replace('{{user}}', member).replace('{{reason}}', reason).replace('{{args[1]}}', this.args[1]))
                message.alphaReply({ embeds: [embed] });
            })
            .catch((err) => {
                //this.console.error(err)
                message.alphaReplyError(`${this.structure.mute.embed2_description} ${member}`)
            });
    }
}
