const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26, 22]
        this.name = ['queue', 'list', 'q'];
        this.helpen = 'Shows the music queue';
        this.help = 'Mostra a fila de música';
    }

    async run(message) {
        const queue = this.client.queues.get(message.guild.id);

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)

        var page = 1
        var maxPage = Math.floor(queue.songs.length/5.1)+1
        let footer = `(${page-1}/${maxPage-1})`


        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setTitle(`${queue.songs.length-1} ${this.structure.queue.embed_title} | ${this.formatTime(this.time(queue), 1)}`)
            .setDescription(this.list(1, queue))
            .setFooter({ text: footer })
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setEmoji('◀️')
                    .setDisabled(true)
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setEmoji('▶️')
                    .setDisabled(maxPage <= 1 ? true : false)
                    .setStyle('SECONDARY'),
            );

        let msg = await message.alphaReply({ embeds: [embed], components: [row] })


        msg.createMessageComponentCollector({ filter: i => i.user.id == message.user.id, time: 120000 })
        .on('end', () => {
            let components = msg.components
            for (let i in components) {
                for (let a in components[i].components) {
                    if (components[i].components[a].setPlaceholder) components[i].components[a].setPlaceholder(this.events.commands.timeout)
                    components[i].components[a].setDisabled(true)
                }                
            }
            msg.edit({ components }).catch(() => null)
        })
        .on('collect', async (i) => {
            await i.deferUpdate()

            if (i.customId == 'next') {
                page += 1

                let components = msg.components

                if (page <= 1) components[0].components[0].setDisabled(true)
                else components[0].components[0].setDisabled(false)
                if (page >= maxPage) components[0].components[1].setDisabled(true)
                else components[0].components[1].setDisabled(false)

                embed
                    .setColor(this.config.botColor1)
                    .setTitle(`${queue.songs.length-1} ${this.structure.queue.embed_title} | ${this.formatTime(this.time(queue), 1)}`)
                    .setDescription(this.list(page, queue))
                    .setFooter({ text: `(${page-1}/${maxPage-1})` })
                msg.edit({ embeds: [embed], components }).catch(() => null)
            } else if (i.customId == 'previous') {
                page -= 1

                let components = msg.components

                if (page <= 1) components[0].components[0].setDisabled(true)
                else components[0].components[0].setDisabled(false)
                if (page >= maxPage) components[0].components[1].setDisabled(true)
                else components[0].components[1].setDisabled(false)

                embed
                    .setColor(this.config.botColor1)
                    .setTitle(`${queue.songs.length-1} ${this.structure.queue.embed_title} | ${this.formatTime(this.time(queue), 1)}`)
                    .setDescription(this.list(page, queue))
                    .setFooter({ text: `(${page-1}/${maxPage-1})` })
                msg.edit({ embeds: [embed], components }).catch(() => null)
            }
        })
    }

    list(page, queue) {
        let txt = ''

        if (queue.songs.length <= page){
            for(i = 0; i < queue.songs.length; i++){
                if (i == 0) 
                    txt += `**${this.structure.queue.now}:**\n [${queue.songs[i].title}](<${queue.songs[i].url}>)\n**\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                else if (i == 1)
                    txt += `**${this.structure.queue.next}:\n\`${i} -\`** [${queue.songs[i].title}](<${queue.songs[i].url}>)\n **\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                else
                    txt += `**\`${i} -\`** [${queue.songs[i].title}](<${queue.songs[i].url}>)\n**\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
            }
        } else {
            if (queue.songs.length < 5*page) {
                for (i = 5*page-5; i < queue.songs.length; i++){
                    if (i == 0) 
                        txt += `**${this.structure.queue.now}:**\n [${queue.songs[i].title}](<${queue.songs[i].url}>)\n**\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                    else if (i == 1)
                        txt += `**${this.structure.queue.next}:\n\`${i} -\`** [${queue.songs[i].title}](<${queue.songs[i].url}>)\n **\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                    else
                        txt += `**\`${i} -\`** [${queue.songs[i].title}](<${queue.songs[i].url}>)\n**\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                }
            } else {
                for (i = 5*page-5; i < 5*page; i++){
                    if (i == 0) 
                        txt += `**${this.structure.queue.now}:**\n [${queue.songs[i].title}](<${queue.songs[i].url}>)\n**\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                    else if (i == 1)
                        txt += `**${this.structure.queue.next}:\n\`${i} -\`** [${queue.songs[i].title}](<${queue.songs[i].url}>)\n **\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                    else
                        txt += `**\`${i} -\`** [${queue.songs[i].title}](<${queue.songs[i].url}>)\n**\`${queue.songs[i].timestamp} | ${queue.songs[i].user.tag}\`**\n\n`
                }
            }
        }
        return txt;
    }

    time(queue) {
        let time = 0
        for (i = 0; i < queue.songs.length; i++){
            let val = queue.songs[i].duration.seconds*1000
            time += val
        }
        return time;
    }
}
