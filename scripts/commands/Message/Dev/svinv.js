const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.permissionLevel = 1
        this.name = ['svinv']
        this.help = 'Pega o convite de servidores que o bot está'
    }

    async run(message) {
        let guild = await this.client.guilds.fetch(this.args[0]).catch(() => null);
        if (!guild) return message.alphaReplyError('**Não encontrei nenhum servidor**')

        let invites = await guild.invites.fetch().catch(() => null)

        let text = ''
		if (!invites || invites.size <= 0) {
            text = '`1 -` https://discord.gg/'+(await guild.channels.cache.map(function (c) {return c}).filter(function(c) {return c.type == 'GUILD_TEXT'})[0].createInvite({ maxAge: 15000, maxUses: 1 })).code
        } else {
            invites = invites.map((inv) => inv.code)

            for (let i = 0; i < invites.length; i++)
                text += `\`${i+1} -\` https://discord.gg/${invites[i]}\n`
        }
        
        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL({ dynamic: true, format: "png", size: 1024 }))
            .setDescription(text)
        return message.alphaReply({ embeds: [embed] })
    }
}
