const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(liveId) {
        let channel = await this.client.channels.fetch('766010021427150868');
        let liveInfo = await this.getTwitchLiveInfo(liveId);
        let channelInfo = await this.getTwitchChannelInfo(liveInfo.user_login);

        if (!liveInfo || !channel || !channelInfo) return setTimeout(() => this.TWNotify(liveId), 2000)

        let guilds = (await this.client.schemas['serv'].find()).filter(g => g.TWChannelsToNotify && g.TWChannelsToNotify?.includes(channelInfo.login) && g.TWNotificationChannel != 'off')
        this.console.custom('bgMagenta', 'magenta', `TW: Live de "${channelInfo.login}" notificada`)

        for (let i in guilds) {
            let DBGuild = guilds[i]
			let guild = await this.client.guilds.fetch(guilds[i]._id).catch(() => null)
			let channel = await guild?.channels.fetch(guilds[i].TWNotificationChannel).catch(() => null)

            if (channel) {
                const attachment = new MessageAttachment(liveInfo.thumbnail_url.replace('{width}x{height}.jpg', '1280x720.jpg'), `Alpha-TW-Live.jpg`);

                const embed = new MessageEmbed()
                    .setColor(8388736)
                    .setAuthor({ name: liveInfo.user_name, iconURL: channelInfo.profile_image_url || 'https://cdn.discordapp.com/emojis/826946819032481862.png' })
                    .setThumbnail('https://cdn.discordapp.com/emojis/826946819032481862.png')
                    //.setTitle(':red_circle: '+liveInfo.title)
                    .setDescription(`:placard: \`Título:\` **${liveInfo.title}**\n\n:video_game: \`Jogando:\` **${liveInfo.game_name || null}**\n\n:link: \`Link:\` https://www.twitch.tv/${liveInfo.user_login}`)
                    .setImage(`attachment://Alpha-TW-Live.jpg`)
                channel.send({ content: DBGuild.TWNotificationText == '§' ? null : DBGuild.TWNotificationText, embeds: [embed], files: [attachment] }).catch(() => null)
            }
        }

        return liveId
    }
}