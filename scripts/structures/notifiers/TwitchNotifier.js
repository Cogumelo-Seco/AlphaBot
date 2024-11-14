module.exports = check = async (client) => {
    const Functions = client.functions

    let guilds =  (await client.schemas['serv'].find()).filter(g => g.TWChannelsToNotify && g.TWChannelsToNotify[0])
    let addedChannels = [ ]
    for (let i in guilds) {
        guilds[i].TWChannelsToNotify?.forEach((channelId) => {
            if (!addedChannels.includes(channelId)) addedChannels.push(channelId)
        })
	}

    if (!client.TwitchNotifierChannelsLength) Functions.console.custom('bgMagenta', 'magenta', `TW: ${addedChannels.length} canais da Twitch`)
    if (client.TwitchNotifierChannelsLength > addedChannels.length) Functions.console.custom('bgMagenta', 'magenta', `TW: ${client.YouTubeNotifierChannelsLength-addedChannels.length} canais da Twitch removidos`)
    if (client.TwitchNotifierChannelsLength < addedChannels.length) Functions.console.custom('bgMagenta', 'magenta', `TW: ${addedChannels.length-client.YouTubeNotifierChannelsLength} canais da Twitch adicionados`)
    client.TwitchNotifierChannelsLength = addedChannels.length

    for (let i in addedChannels) {
        let userName = addedChannels[i]
        let channelInfo = await Functions.getTwitchChannelInfo(userName);
        let liveInfo = await Functions.getTwitchLiveInfo(channelInfo?.id);

        if (liveInfo) {
            liveInfo.started_at = new Date(liveInfo.started_at)

            if (+client.readyAt <= +liveInfo.started_at && !client.TWLastLives.includes(liveInfo.id)) {
                client.TWLastLives.push(liveInfo.id)
                Functions.TWNotify(channelInfo.id)
            }
        }
    }
}