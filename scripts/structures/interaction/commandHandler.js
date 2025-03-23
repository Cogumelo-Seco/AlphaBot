const { MessageEmbed } = require('discord.js')
const Functions = require('../functions');

module.exports = async (client, interaction, structure, events, config, guildResult) => {
    const AlphaConsole = client.functions.console

    interaction.pingTimestamp = +new Date();
	interaction.attachments = new Map();

	const commandName = interaction.commandName;
	const options = interaction.options._hoistedOptions;
	let args = [];
	for (i in options) {
		if (options[i].type == 'ATTACHMENT') interaction.attachments.set(options[i].value, options[i].attachment)
		else args.push(options[i].value)
	}

	let getCommand = client.slashCommands[commandName].class
	await require('./interactionProps')(client, interaction, args, commandName);

	if (!getCommand) return interaction.alphaReplyError('Error: command not found.**').catch(() => null)

	const userResult = await client.schemas['user'].findById(interaction.user.id);
	if (!userResult) {
		require('../configs/registerUser')(client, interaction.user, interaction.guild, config)
		return interaction.alphaReplyError(events.dbs.noauthor)
	}

	const verifiPermissions = await require('./filterPermissions')(userResult, guildResult, interaction, getCommand, config, events, client)		
	if (verifiPermissions != true) return;

	userResult.commandsCounter += 1
	await userResult.save()

	setTimeout(async() => {
		//if (!interaction.deferred && !interaction.replied) interaction.deferReply()
	}, 3000-(+new Date() - interaction.createdTimestamp))

	new getCommand({
		config,
		client,
		args,
		structure,
		events,
		message: interaction,
		slashCommand: true
	}).run(interaction).catch(async (err) => {
		console.log(err)
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
	
	require('./commandLog')(client, config, interaction);
};