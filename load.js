const express = require('express');
const app = express();
const PORT = 3000//process.env.PORT

app.listen(PORT)

app.get("/", (req, res) => {
	res.sendStatus(200)
});

const { Client } = require('discord.js');
const client = new Client({ 
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES'],
    disableMentions: 'everyone', 
    messageCacheMaxSize: 50,
    autoReconnect: true,
    ws: {
        properties: { 
            $browser: "Discord iOS" 
        }
    }
});
const config = process.env

require('./scripts/structures/clientSettings.js')(client, app)

let api = require('./scripts/structures/API.js')
app.use("/commands", (req, res) => res.json(api.commands(client)));

process.on('warning', e => client.functions.console.warn(e));
process.on('unhandledRejection', e => {
    if (e.code != 10062 && e.code != 40060) client.functions.console.error(e)
});

require('./scripts/structures/functions/canvas/registerFonts')();
require('./scripts/structures/topGG.js')(client);
require('./scripts/structures/EventManager.js')(client);
require('./scripts/structures/dbs/DBConnection.js')(config, client);
