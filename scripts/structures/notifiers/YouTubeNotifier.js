const RSSParser = require("rss-parser")
const parser = new RSSParser()

module.exports = check = async (client) => {
    const Functions = client.functions
    let guilds =  (await client.schemas['serv'].find()).filter(g => g.YTChannelsToNotify && g.YTChannelsToNotify[0])
    let addedChannels = [ ]
    for (let i in guilds) {
        guilds[i].YTChannelsToNotify?.forEach((channelId) => {
            if (!addedChannels.includes(channelId)) addedChannels.push(channelId)
        })
	}

    if (!client.YouTubeNotifierChannelsLength) Functions.console.custom('bgRed', 'red', `[YOUTUBE] ${addedChannels.length} canais`)
    if (client.YouTubeNotifierChannelsLength > addedChannels.length) Functions.console.custom('bgRed', 'red', `[YOUTUBE] ${client.YouTubeNotifierChannelsLength-addedChannels.length} canais removidos`)
    if (client.YouTubeNotifierChannelsLength < addedChannels.length) Functions.console.custom('bgRed', 'red', `[YOUTUBE] ${addedChannels.length-client.YouTubeNotifierChannelsLength} canais adicionados`)
    client.YouTubeNotifierChannelsLength = addedChannels.length

    for (let i in addedChannels) {
		let video = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${addedChannels[i]}`).then((r) => r.items[0]).catch(() => null)
		
		if (video) {
			video.pubDate = new Date(video.pubDate)
			video.videoId = video.id.replace('yt:video:', '')

			if (+client.readyAt <= +video.pubDate && !client.YTLastVideos.includes(video.videoId)) {
				client.YTLastVideos.push(video.videoId)
				Functions.YTNotify(video.videoId)
			}
		}
    }
}