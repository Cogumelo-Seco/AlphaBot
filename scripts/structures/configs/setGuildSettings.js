module.exports = async (client) => {
    let guilds = client.guilds.cache.map(g => g)

    for (let i in guilds) {
        let guild = guilds[i]
        guild.settings = await client.schemas['serv'].findById(guild.id);
    }
}