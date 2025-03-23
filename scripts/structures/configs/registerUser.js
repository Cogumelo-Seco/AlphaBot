module.exports = async (client, user, guild, config) => {
    const userResultRank = await client.schemas['rank'].findById(guild.id+user.id)
    const userResult = await client.schemas['user'].findById(user.id);

    if (!userResult) {
        let userSchema = client.schemas['user']
        let userS = new userSchema({
            _id: `${user.id}`,
            diamonds: 13,
            diamondsDelay: 0,
            alphaCoins: 13,
            alphaCoinsDelay: 0,
            bank: 13,
            color: config.botColor1,
            aboutme: "Sou uma pessoa que gosta muito do Alpha ❤️ (Você pode trocar esta mensagem usando o comando aboutme)",
            ban: false,
            commandsCounter: 0,
            voteCounter: 0,
            marryID: 'off',
            magicstones: 0,
            RPGPlayer: { xp: 0 }
        });

        userS.save().catch((err) => client.functions.console.error('[REGISTERUSER] ERRO: '+err));
    }

    if (!userResultRank) {
        let rankSchema = client.schemas['rank']
        let userS = new rankSchema({
            _id: guild.id+user.id,
            guildID: guild.id,
            userID: user.id,
            xp: 0,
            level: 0,
            totalXP: 0
        });

        userS.save().catch((err) => client.functions.console.error('[REGISTERUSER] ERRO: '+err));
    }
}