module.exports = async(client) => {
	const AlphaConsole = client.functions.console
	const config = process.env

	AlphaConsole.log(`Online, ${client.user.username} está pronto.`);

	require('../structures/loadCommands.js')(client, config);

	/* ---- */

	let notifiers = () => {
		require('../structures/notifiers/YouTubeNotifier')(client)
		require('../structures/notifiers/TwitchNotifier')(client)

		setTimeout(notifiers, 30000)
	}
	notifiers()

	/* ---- */

	require('../structures/configs/CoguServer.js')(client)

	/* ---- */

	setInterval(async () => {
		return require(`../structures/statusBot.js`)(client, config);
	}, 20000);

	return client.user.setActivity('😴| Acabei de acordar', { type: 'LISTENING' })
}