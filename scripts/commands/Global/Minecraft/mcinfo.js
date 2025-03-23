const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'servidor',
                description: 'Adicione um nome de servidor Minecraft para ver informações',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['mcinfo', 'minecraftinfo'];
        this.helpen = 'Displays information from a Minecraft server';
        this.help = 'Mostra as informações de um servidor Minecraft';

        this.howToUsePT = '<ip de um servidor minecraft>'
        this.howToUseEN = '<ip of a minecraft server>'
    }

    async run(message) {
        const embed = new MessageEmbed();
        const server = this.args.slice(0).join(' ');

        const { body } = await request.get(`https://api.mcsrvstat.us/2/${server}`).then().catch((a) => {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.structure.mcinfo.nofind)
            return message.alphaReply({ embeds: [embed] })
        })

        if (body && !body.players) {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.structure.mcinfo.nofind)
            return message.alphaReply({ embeds: [embed] })
        } else if (body) {
            embed
                .setColor(this.config.botColor1)
                .setThumbnail(`https://api.mcsrvstat.us/icon/${server}`)
                .setDescription(` **<:redpanda_minecraft:828400937248489482> ${(this.structure.mcinfo.title).replace('{{server}}', `\`${server}\``)} (${body.online ? 'online' : 'offline'})**\n**IP: \`${body.ip  || null}\`\n${this.structure.mcinfo.players}: \`${body.players.online  || null} / ${body.players.max || null}\`\n${this.structure.mcinfo.hostname}: \`${body.hostname || null}\`\nSoftware: \`${body.software || null}\`\n${this.structure.mcinfo.versions}:\n\`${body.version || null}\`\nMotd:\n\`${(body.motd.clean[0]).replace(/\s+/g, ' ') || null}\n${(body.motd.clean[1]).replace(/\s+/g, ' ') || null}\`**`)
            return message.alphaReply({ embeds: [embed] })
        }
    }
}

