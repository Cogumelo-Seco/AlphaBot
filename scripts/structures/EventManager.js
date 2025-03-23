const { readdirSync } = require('fs');
const { join } = require('path');
const filePath = join(__dirname, "..", "events");

module.exports = async (client) => {
    let eventFiles = readdirSync(filePath);
    for (let eventFile of eventFiles) {
        if (eventFile.endsWith('.js')) {
            let event = require(`${filePath}/${eventFile}`);
            let eventName = eventFile.split('.').shift();
            client.on(eventName, event.bind(null, client));
        }
    }
}