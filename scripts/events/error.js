const config = process.env

module.exports = async (client, err) => {
	const AlphaConsole = client.functions.console

    AlphaConsole.error('[ERROREVENT] ERRO: '+err)

	const channel = await client.fetchWebhook(config.WEBHOOK2.split('|')[0], config.WEBHOOK2.split('|')[1]);
	const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack

	const msg = new Discord.MessageEmbed()
		.setTimestamp()
		.setColor(config.color)
		.setDescription(`**<a:engrenagem:805200447921061949> ERRO:\`\`\`js\n${errorMessage}\`\`\`**`)
	channel.send({ embeds: [msg] }).catch(() => null)
}