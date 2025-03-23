const config = process.env;

module.exports = async (client, interaction) => {
	const AlphaConsole = client.functions.console
	
	if (interaction.isAutocomplete()) {
		const guildResult = await client.schemas['serv'].findById(interaction.guildId);

		if (!guildResult) return require('../structures/configs/registerGuild')(client, interaction.guild, config)

		const structure = require(`../language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/commands.json`)//JSON.parse(fs.readFileSync(`./scripts/language/${guildResult.region == 'pt' ? 'pt-BR' : 'en'}/commands.json`, { encoding:'utf8' }))
		const events = require(`../language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/events.json`)//JSON.parse(fs.readFileSync(`./scripts/language/${guildResult.region == 'pt' ? 'pt-BR' : 'en'}/events.json`, { encoding:'utf8' }))

		let getCommand = client.slashCommands[interaction.commandName].class

		new getCommand({
			config,
			client,
			structure,
			events,
			message: interaction,
			slashCommand: true
		}).autocomplete(interaction).catch(async (err) => {
			AlphaConsole.error(`[INTERACTION] ${err}`)
			interaction.alphaReplyError(`**Error: \n\`\`\`${err}\`\`\`**`).catch(() => null)
	
			let channel = await client.fetchWebhook(config.WEBHOOK2.split('|')[0], config.WEBHOOK2.split('|')[1])
			const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack
	
			const msg = new MessageEmbed()
				.setColor(config.botColor2)
				.setTimestamp()
				.setDescription(`**ERRO:**\`\`\`js\n${errorMessage}\`\`\`\n**Comando:** \`\`${commandName}\`\``)
			return channel.send({ embeds: [msg] }).catch(() => null)
		})
	}

	if (interaction.isCommand()) {
		const guildResult = await client.schemas['serv'].findById(interaction.guildId);

		if (!interaction.channel) return

		if (!guildResult) {
			interaction.reply(`<a:not:797347840312868864> **| PT:** O servidor não estava registrado em minha DB, por favor tente novamente.\n<a:not:797347840312868864> **| EN:** The server was not registered in my DB, please try again.`)
			return require('../structures/configs/registerGuild')(client, interaction.guild, config)
		}

		const structure = require(`../language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/commands.json`)//JSON.parse(fs.readFileSync(`./scripts/language/${guildResult.region == 'pt' ? 'pt-BR' : 'en'}/commands.json`, { encoding:'utf8' }))
		const events = require(`../language/${guildResult.language == 'pt' ? 'pt-BR' : 'en'}/events.json`)//JSON.parse(fs.readFileSync(`./scripts/language/${guildResult.region == 'pt' ? 'pt-BR' : 'en'}/events.json`, { encoding:'utf8' }))

		require(`../structures/interaction/commandHandler.js`)(client, interaction, structure, events, config, guildResult)
	}
}