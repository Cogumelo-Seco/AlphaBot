const { MessageAttachment } = require('discord.js');

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    run(props) {
        let msg = props[0]
        let name = props[1]

        if (!msg) return;
        let attachment = new MessageAttachment(Buffer.from(msg, 'utf-8'), `${name || 'Alpha-file'}.txt`);
        return attachment;
    }
}