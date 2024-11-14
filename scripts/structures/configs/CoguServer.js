module.exports = async(client) => {
	info()
	async function info() {
		let guild = await client.guilds.fetch('766009895668547635');
		let channel = await client.channels.fetch('766010023423639644');
		let message = await channel.messages.fetch('1195194824001863782');

		message.createMessageComponentCollector({ })
			.on('collect', async (i) => {
				let role = guild.roles.cache.find(r => r.id === "837044594129895478");
				
				if (i.customId == 'add') {
					if (!i.member._roles.includes('837044594129895478')) {
						i.member.roles.add(role);
						i.reply({ content: ':white_check_mark: Cargo adicionado!!', ephemeral: true });
					} else i.reply({ content: '<a:not:797347840312868864> Você já possui este cargo!!', ephemeral: true });
				} else {
					if (i.member._roles.includes('837044594129895478')) {
						i.member.roles.remove(role);
						i.reply({ content: ':white_check_mark: Cargo removido.', ephemeral: true });
					} else i.reply({ content: '<a:not:797347840312868864> Não existe nenhum cargo para remover.', ephemeral: true });
				}
			});
	}

	verify()
	async function verify() {
		let guild = await client.guilds.fetch('766009895668547635');
		let channel = await client.channels.fetch('766010025352757248');
		let message = await channel.messages.fetch('1195197252608725013');

		message.createMessageComponentCollector({ })
			.on('collect', async (i) => {
				await i.deferUpdate();
				let role1 = guild.roles.cache.find(r => r.id === "766009995753291776");
				let role2 = guild.roles.cache.find(r => r.id === "766009993581166618");

				i.member.roles.add(role1);
				i.member.roles.remove(role2);
			});
	}
}