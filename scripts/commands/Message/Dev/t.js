const Functions = require('../../../structures/functions/index');
const { MessageActionRow, MessageButton, MessageAttachment, MessageEmbed } = require('discord.js')
const request = require('node-superfetch')

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.permissionLevel = 1
        this.name = ['t'];
        this.help = 'Comando para testes';
    }

    async run(message) {
        /*let guilds = await this.client.guilds.cache.map(function (g) {return g})
        
        let count = 0
        let guildsFiltred = []
        for (let i in guilds) {
            let member = await guilds[i].members.fetch('535560016418177025').catch(() => null)
            if (member) guildsFiltred.push(guilds[i])
            count += 1
            console.log(count)
        }
        
        '1191130236662857748',
        '1165967642474057728',
        '1002681451843702854',
        console.log(guildsFiltred)*/

        let guildInfo = await this.client.guilds.fetch('1165967642474057728')
        let membersInfo = (await guildInfo.members.fetch()).filter(m => !m.user.bot)
        console.log(membersInfo)
        //for (let i in membersInfo) {
        //    console.log(membersInfo[i].name)
        //}



        //return guilds[1].members.fetch('741352048271818823').catch(function() {return null })
//[1].members.fetch('686746214653624323')
//.filter(function (g) {return g.members.fetch('686746214653624323')})
        /*const fetch = require("node-fetch");

        //let channelID = '153893302'
        let channelID = '38244180'

        let res = await fetch(`https://api.twitch.tv/helix/users?login=felps`, {
            method: 'GET',
            json: true,
            headers: {
                'Authorization': `Bearer ${this.config.twitchAppTOKEN}`,
                'Client-Id': this.config.twitchAppID,
                'Content-Type':'application/json'
            }
        }).then(res => res.json()).catch(err => console.log(err))

        this.console.log(res.data[0])
/*
        let res = await fetch(`https://api.twitch.tv/helix/streams?user_id=${channelID}`, {
            method: 'GET',
            json: true,
            headers: {
                'Authorization': `Bearer ${this.config.twitchAppTOKEN}`,
                'Client-Id': this.config.twitchAppID,
                'Content-Type':'application/json'
            }
        }).then(res => res.json()).catch(err => console.log(err))

        this.console.log(res.data[0])
        /*let r = await request.get('https://www.roblox.com/games/6516141723/DOORS')

        console.log(r.text.split('Yes'))*/

        /*let player = await this.verifyRPGPlayer(message.user)

        let canvas = await this.canvasImages.RPGPlayerStatus(player, this.config.botColor1)
        if (!canvas) return

        const embed = new MessageEmbed()
			.setColor(this.config.botColor1)
            .setImage(`attachment://img.png`)
			.setDescription(this.structure.dungeon.embed)
			.setThumbnail(message.user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL)

        let attachment = new MessageAttachment(await this.canvasImages.RPGPlayerStatus(player, this.config.botColor1), `img.png`);

        return message.alphaReply({ embeds: [embed], files: [attachment] });
        
        //player.attack = 10
        //player.totalMana = 100
        //player.totalLife = 100
        //player.mana = player.totalMana
        //player.life = player.totalLife
        //player.level = 1
        //player.xp = 0
        player.rest = '0-A'
        player.items = {
            usable: [
                {
                    type: 'regenerate',
                    name: 'Special',
                    name_EN: 'Special (EN)',
                    amount: 1000,
                    usable: true,
                    power: {
                        life: 20,
                        mana: 20,
                    },
                    description: 'Recupera vida e mana',
                    description_EN: 'Recupera vida e mana (EN)'
                },
                {
                    type: 'regenerate',
                    name: 'Special2',
                    name_EN: 'Special2 (EN)',
                    amount: 1000,
                    usable: true,
                    power: {
                        life: 5,
                        mana: 5,
                    },
                    description: 'Recupera vida e mana',
                    description_EN: 'Recupera vida e mana (EN)'
                }
            ],
            unusable: []
        }

        const userResult = await this.client.schemas['user'].findById(message.author.id);
        userResult.RPGPlayer = player
		await userResult.save()*/
    }
}