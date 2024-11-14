const Canvas = require('canvas');
const twemoji_parser_1 = require("twemoji-parser");

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(props) {
        let ctx = props[0]
        let text = props[1]
        let x = props[2]
        let y = props[3]
        let maxWidth = props[4]
        let type = props[5]

        let fontSize = parseInt(ctx.font.replace(/[^\d.]/g, ''));
        let emojiSideMargin = fontSize * 0.05;
        let emojiUpMargin = fontSize * 0.2;
        let entity = text.split(" ");
        let currWidth = 0;
        for (let i = 0; i < entity.length; i++) {
            const ent = entity[i]
            let parsed = twemoji_parser_1.parse(ent);
            let id = ent.match(/<?(a:|:)\w*:(\d{17}|\d{18})>/) ? ent.match(/<?(a:|:)\w*:(\d{17}|\d{18})>/)[2] : null
    
            if (id) {
                let img = await Canvas.loadImage(`https://cdn.discordapp.com/emojis/${id}.png`);
                ctx.drawImage(img, x + currWidth + emojiSideMargin, (y - fontSize)+emojiUpMargin, fontSize, fontSize);
                currWidth += fontSize + emojiSideMargin * 2 + fontSize / 5;
            } else if (parsed.length > 0) {
                let img = await Canvas.loadImage(parsed[0].url);
                ctx.drawImage(img, x + currWidth + emojiSideMargin, (y - fontSize)+emojiUpMargin, fontSize, fontSize);
                currWidth += fontSize + emojiSideMargin * 2 + fontSize / 5;
            } else {
                if (type == 'stroke') ctx.strokeText(ent, x + currWidth, y, maxWidth || undefined);
                else ctx.fillText(ent, x + currWidth, y, maxWidth || undefined);
                currWidth += ctx.measureText(ent).width + fontSize / 5;
            }
        }
    };
}