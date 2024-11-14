const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26, 22];
        this.name = ['ping'];
        this.helpen = 'Send latency information';
        this.help = 'Envia informações de latência';
    }

    async run(message) {
        let responsePingTimestamp = +new Date()-message.pingTimestamp
        let DBPing = +new Date()
        await this.client.schemas['user'].findById(message.user.id)
        DBPing = +new Date()-DBPing

        let embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setTitle(`🐧 | Pingo!`)
            .setDescription(`**⏱️ | ${this.structure.ping.response}:** \`${responsePingTimestamp}ms\`\n**📝 | ${this.structure.ping.edit}:** \`???ms\`\n**⚡ | ${this.structure.ping.api}:** \`${Math.round(this.client.ws.ping)}ms\`\n**📚 | ${this.structure.ping.db}**: \`${DBPing}ms\`\n**🖲️ | Shard:** \`${Number(this.client.shard.ids)+1}/${this.client.shard.count}\``)

        let msg = await message.alphaReply({ embeds: [embed] })
        if (!msg) return

        let editPingTimestamp = +new Date()

        embed.setDescription(`**⏱️ | ${this.structure.ping.response}:** \`${responsePingTimestamp}ms\`\n**📝 | ${this.structure.ping.edit}:** \`???ms\`\n**⚡ | ${this.structure.ping.api}:** \`${Math.round(this.client.ws.ping)}ms\`\n**📚 | ${this.structure.ping.db}**: \`${DBPing}ms\`\n**🖲️ | Shard:** \`${Number(this.client.shard.ids)+1}/${this.client.shard.count}\``)
        await msg.edit({ embeds: [embed] }).catch(() => null)

        embed.setDescription(`**⏱️ | ${this.structure.ping.response}:** \`${responsePingTimestamp}ms\`\n**📝 | ${this.structure.ping.edit}:** \`${+new Date()-editPingTimestamp}ms\`\n**⚡ | ${this.structure.ping.api}:** \`${Math.round(this.client.ws.ping)}ms\`\n**📚 | ${this.structure.ping.db}**: \`${DBPing}ms\`\n**🖲️ | Shard:** \`${Number(this.client.shard.ids)+1}/${this.client.shard.count}\``)
        msg.edit({ embeds: [embed] }).catch(() => null)
    }
}