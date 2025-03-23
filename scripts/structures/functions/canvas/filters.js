const Canvas = require('canvas')

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
        this.config = process.env
    }

    async watermark (client, ctx, canvas, message) {
        if (message && this.config.owners.includes(message.user.id)) return;
        const clientAvatar = await Canvas.loadImage(client.user.avatarURL({ format: 'png' }))
        if (canvas.width <= canvas.height) return ctx.drawImage(clientAvatar, canvas.width-(canvas.width/24), canvas.height-(canvas.width/24), (canvas.width/24), (canvas.width/24))
        if (canvas.height <= canvas.width) return ctx.drawImage(clientAvatar, canvas.width-(canvas.height/24), canvas.height-(canvas.height/24), (canvas.height/24), (canvas.width/24))
    }
    
    invert(ctx, canvas) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
        }
    
        return ctx.putImageData(imgData, 0, 0);
    }
    
    greyscale(ctx, canvas) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
        for (let i = 0; i < imgData.data.length; i += 4) {
            const brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
            imgData.data[i] = brightness;
            imgData.data[i + 1] = brightness;
            imgData.data[i + 2] = brightness;
        }
    
        return ctx.putImageData(imgData, 0, 0);
    }
    
    async imageFilter(client, image, background, message) {
        const canvas = Canvas.createCanvas(720, 720);
        const ctx = canvas.getContext('2d');
    
        const backgroundCanvas = await Canvas.loadImage(background).catch(() => null)
        if (!backgroundCanvas) return;
        ctx.drawImage(backgroundCanvas, 0, 0, canvas.width, canvas.height)
    
        await this.watermark(client, ctx, canvas, message);
    
        const imageCanvas = await Canvas.loadImage(image)
        ctx.globalAlpha = 0.5
        ctx.drawImage(imageCanvas, 0, 0, canvas.width, canvas.height)
    
        return canvas.toBuffer()
    }
    
    async wastedFilter(client, imageURL, text, message) {
        const canvas = Canvas.createCanvas(720, 720);
        const ctx = canvas.getContext('2d');
    
        const background = await Canvas.loadImage(imageURL).catch(() => null);
        if (!background) return;
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        await this.watermark(client, ctx, canvas, message);
        this.greyscale(ctx, canvas, client);
    
        const canvas2 = Canvas.createCanvas(canvas.width, 140);
        const ctx2 = canvas2.getContext('2d');
    
        ctx2.fillStyle = 'black';
        ctx2.globalAlpha = 0.5
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    
        ctx2.globalAlpha = 1
        ctx2.font = '115px Pricedown'
        ctx2.fillStyle = '#c93e4e'
        let textWithoutEmojis = ''
        let split = text.split(' ')
        for (i = 0; i < split.length; i++) {
            let match = split[i].match(/<?(a:|:)\w*:(\d{17}|\d{18})>/)
            if (match) textWithoutEmojis += 'ai '
            else textWithoutEmojis += split[i]+' '
        }
        await this.fillWithEmoji(ctx2, text, canvas2.width/2-ctx2.measureText(textWithoutEmojis).width/2, canvas2.height/2+35)
        ctx2.lineWidth = 4;
        await this.fillWithEmoji(ctx2, text, canvas2.width/2-ctx2.measureText(textWithoutEmojis).width/2, canvas2.height/2+35, undefined, 'stroke')
    
        const textImage = await Canvas.loadImage(canvas2.toBuffer())
        ctx.drawImage(textImage, 0, canvas.height/2-(140/2), canvas2.width, canvas2.height)
    
        return canvas.toBuffer();
    }
    
    async color(ctx, canvas, color, intensity) {
        if (!color) return ctx;
        if (!intensity) intensity = 1.5
        
        const canvasColor = Canvas.createCanvas(1, 1);
        const ctxColor = canvasColor.getContext('2d');
        ctxColor.fillStyle = color;
        ctxColor.fillRect(0, 0, 1, 1);
        const colorImgData = ctxColor.getImageData(0, 0, 1, 1)
    
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
            if (colorImgData.data[0] == 0 && colorImgData.data[1] == 0 && colorImgData.data[2] == 0) {
                imgData.data[i] = (imgData.data[i]+colorImgData.data[0])/intensity
                imgData.data[i+1] = (imgData.data[i+1]+colorImgData.data[1])/intensity
                imgData.data[i+2] = (imgData.data[i+2]+colorImgData.data[2])/intensity
            } else {
                if (colorImgData.data[0] > imgData.data[i]) imgData.data[i] = (imgData.data[i]+colorImgData.data[0])/intensity
                else colorImgData.data[0]
                if (colorImgData.data[1] > imgData.data[i+1]) imgData.data[i+1] = (imgData.data[i+1]+colorImgData.data[1])/intensity
                else colorImgData.data[1]
                if (colorImgData.data[2] > imgData.data[i+2]) imgData.data[i+2] = (imgData.data[i+2]+colorImgData.data[2])/intensity
                else colorImgData.data[2]
            }
        }
    
        return ctx.putImageData(imgData, 0, 0);
    }
}