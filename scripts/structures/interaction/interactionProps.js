module.exports = async (client, interaction, args, commandName) => {
    interaction.guild = await client.guilds.fetch(interaction.guildId).catch(() => null);
    interaction.channel = await client.channels.fetch(interaction.channelId).catch(() => null);
    interaction.content = args.join(' ');

    interaction.defer = async () => {
        if (!interaction.deferred && !interaction.replied && interaction.deferReply) await interaction.deferReply()
    }

    interaction.alphaReplyError = async (content, options) => {
        let data = {
            content: `<a:not:797347840312868864> **|** ${content}`,
            embeds: [],
            attachments: [],
            components: [],
            ephemeral: true
        }
        for (let i in options) data[i] = options[i]

        if (typeof content == 'object') {
            data = {
                content: `${interaction.user}`,
                embeds: [],
                attachments: [],
                components: [],
                ephemeral: true
            }
            for (let i in content) data[i] = content[i]
        }

        let msg = await interaction.reply(data).catch(() => null)
		if (!msg) msg = await interaction.editReply(data).catch(() => null)

        if (!msg) msg = await interaction.fetchReply().catch(() => null)
		if (msg) msg.commandName = commandName
		
        delete client.userCommand[interaction.user.id];

        return msg
    }

    interaction.alphaReply = async (content, options) => {
        let data = {
            content,
            embeds: [],
            attachments: [],
            components: []
        }
        for (let i in options) data[i] = options[i]

        if (typeof content == 'object') {
            data = {
                content: `${interaction.user}`,
                embeds: [],
                attachments: [],
                components: []
            }
            for (let i in content) data[i] = content[i]
        }

		let msg = await interaction.reply(data).catch(() => null)		
		if (!msg) msg = await interaction.editReply(data).catch(() => null)

		if (!msg) msg = await interaction.fetchReply().catch(() => null)
		if (msg) msg.commandName = commandName
		
        delete client.userCommand[interaction.user.id];

        return msg
    }
}