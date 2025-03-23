const Functions = require('../structures/functions/index')

module.exports = async (client, member) => {
	const guild = member.guild
	const result = await client.schemas['serv'].findById(guild.id); // q diabo é schemas kk
	let msg = result ? new Functions().replaces(result.welcomeMessage, member.user, guild) : null
	const channel = guild.channels.cache.get(result ? result.welcomeChannel : null)

	if (!result || !channel) return;

	try {
		msg = JSON.parse(msg)
        if (msg.embeds && msg.embeds[0]) delete msg.embeds[0].timestamp
		channel.send(msg).catch(() => channel.send(JSON.stringify(msg)).catch(() => null))
	} catch (err) {
		channel.send(msg).catch(() => null)
	}
}