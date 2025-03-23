const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.permissionLevel = 1
        this.name = ['dbclear'];
        this.help = 'Limpa a db de servidores';
    }

    async run(message) {
		if (this.client.user.id != '766006179209936946') return;

		let clientGuildsId = this.client.guilds.cache.map((g) => g.id)
		let dbGuilds = await this.client.schemas['serv'].find()
		let guilds = dbGuilds.filter((g) => !clientGuildsId.includes(g._id))

		for (let guild of guilds) {
			this.client.schemas['serv'].deleteOne({ _id: guild.id }, async function (err) {
				if (err) return message.alphaReplyError('ERRO: '+err)
			});
		}

		return message.alphaReply(`**\`${guilds.length}\` servidores deletados da DB!!**`)
    }
}
