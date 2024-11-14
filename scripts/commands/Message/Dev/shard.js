const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['shards', 'shard'];
    }

    async run(message) {
        let guilds = await this.client.shard.fetchClientValues('guilds.cache.size')
		let ping = await this.client.shard.fetchClientValues('ws.ping')
		let status = await this.client.shard.fetchClientValues('presence.status')
		let uptime = await this.client.shard.fetchClientValues('uptime')

		var txt = 'Shard | Guilds | Ping | Status | Uptime\n'

		for (let i = 0; i < this.config.shardsCount ;i++)
			txt += `  ${String(i).padEnd(4, ' ')}|   ${guilds[i] ? String(guilds[i]).padEnd(5, ' ') : '0'.padEnd(5, ' ')}|  ${ping[i] ? String(ping[i]).padEnd(4, ' ') : 0}| ${status[i] ? status[i].padEnd(5, ' ') : 'off'.padEnd(5, ' ')} | ${this.formatTime(uptime[i]) || 'off'} \n`

		const embed = new MessageEmbed()
			.setColor(this.config.botColor1)
			.setDescription(`\`\`\`${txt}\`\`\``)
		return message.alphaReply({ embeds: [embed] })
    }
}