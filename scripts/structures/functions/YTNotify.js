const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(videoId) {
        let videoInfo = await this.getYTVideoInfo(videoId)
        if (!videoInfo) return setTimeout(() => this.YTNotify(videoId), 2000)

		let guilds = (await this.client.schemas['serv'].find()).filter(g => g.YTChannelsToNotify && g.YTChannelsToNotify?.includes(videoInfo.channelId) && g.YTNotificationChannel != 'off')

        this.console.custom('bgRed', false, `YT: Video "${videoId}" notificado`)

		for (let i in guilds) {
            let DBGuild = guilds[i]
			let guild = await this.client.guilds.fetch(guilds[i]._id).catch(() => null)
			let channel = await guild?.channels.fetch(guilds[i].YTNotificationChannel).catch(() => null)

			if (channel) {
				const attachment = new MessageAttachment(videoInfo.thumbnail.thumbnails[videoInfo.thumbnail.thumbnails.length-1].url, `Alpha-YT-Video.jpg`);
                const channelInfo = await this.getYTChannelInfo(videoInfo.channelId)

                const embed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setAuthor({ name: videoInfo.author, iconURL: channelInfo ? channelInfo.avatar.thumbnails[0].url : 'https://image.flaticon.com/icons/png/512/1384/1384060.png' })
                    .setThumbnail(videoInfo.shorts ? 'https://cdn.discordapp.com/emojis/1119729412607324240.webp' : 'https://www.youtube.com/s/desktop/6007d895/img/favicon_144x144.png')
                    .setDescription(`**🪧 \`${guilds[i].region == 'pt' ? 'Título' : 'Title'}:\` ${videoInfo.title}\n\n🔗 \`Link:\`** ${videoInfo.shorts ? 'https://www.youtube.com/shorts/'+videoId : 'https://www.youtube.com/watch?v='+videoId}`)
                    .setImage(`attachment://Alpha-YT-Video.jpg`)
                channel.send({ content: DBGuild.YTNotificationText == '§' ? null : DBGuild.YTNotificationText, embeds: [embed], files: [attachment] }).catch(() => null)
			}
		}

        return videoInfo
    }
}