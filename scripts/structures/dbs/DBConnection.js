const mongo = require('mongoose');

module.exports = async (config, client) => { 
    const AlphaConsole = client.functions.console

	require('./userSchema.js')(client);
	require('./servSchema.js')(client);
    require('./rankSchema.js')(client);

    mongo.Promise = global.Promise;
    mongo.set('strictQuery', false)
    mongo.connect(config.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        AlphaConsole.custom('bgBrightBlue', 'brightBlue', `Mongoose Conectado!`)
        client.login(config.TOKEN)
    }).catch((err) => AlphaConsole.error('[MONGO] ERRO: ' + err));
}