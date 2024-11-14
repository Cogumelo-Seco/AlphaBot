module.exports = async (client, guild, config) => {
    const servSchema = client.schemas['serv']

	if (!guild || await servSchema.findById(guild.id)) return

    let serv = new servSchema({
        _id: `${guild.id}`,
        rankChannel: 'off',
        rankMessage: `{ "content": "{@member}", "embeds": [{ "description": "**{@member}, Tu subiu para o Nível {lv}!!**", "color": "DEFAULT-COLOR"}]}`,
        language: 'pt',
        welcomeChannel: 'off',
        welcomeMessage: `{ "content": "{@member}","embeds": [{ "title": "Bem-Vindo(a)" ,"description": "{@member}, bem-vindo(a) ao servidor **{guildName}**! Atualmente estamos com **{guildMemberCount} membros**.","color": "DEFAULT-COLOR","timestamp": "{date}","thumbnail": {"url": "{avatar}"},"author": {"name": "{memberTag} ({memberId})","icon_url": "{avatar}"}}]}`,
        leaveChannel: 'off',
        leaveMessage: `{"content": "{@member}","embeds": [{"title": "F","description": "{@member}, saiu do servidor, agora estamos com **{guildMemberCount} membros**.","color": "DEFAULT-COLOR","thumbnail": { "url": "{avatar}" },"author": { "name": "{memberTag} ({memberId})", "icon_url": "{avatar}" }}]}`,
        YTChannelsToNotify: [],
        YTNotificationChannel: 'off',
        YTNotificationText: '§',
        TWChannelsToNotify: [],
        TWNotificationChannel: 'off',
        TWNotificationText: '§'
    });
    serv.save().catch((err) => console.error('[REGISTERGUILD] ERRO: '+err))
	return client.guilds.cache.get(guild.id).settings = serv;
}