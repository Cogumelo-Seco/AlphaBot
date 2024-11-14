const Canvas = require('canvas');
const GIFEncoder = require('gif-encoder-2');
const gifFrames = require('gif-frames');

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }
    
    async rankCard(config, client, user, result, rank, color) {
        const canvas = Canvas.createCanvas(1811, 572);
        const ctx = canvas.getContext('2d');
        const Badges = require('../../configs/Badges')
    
        const avatar = await Canvas.loadImage(user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || user.defaultAvatarURL)
        
        const background = await Canvas.loadImage('./scripts/structures/functions/canvas/images/default_card.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        const currentXP = result ? result.xp : 0;
        const requiredXP = result ? Math.floor(10 * result.level ** 2 + 40 * result.level + 100) : 0;
        const percent = currentXP/requiredXP
    
        // Barra de progresso
        ctx.fillStyle = 'gray'
        ctx.fillRect(66, canvas.height-245, percent*981, 154);

        ctx.save()

        ctx.beginPath();
        ctx.arc(1476, 286, 250, 0, Math.PI * 2, true);
        ctx.clip();
    
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0.00, '#444343');
        gradient.addColorStop(1.00, '#000000');
    
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 16;
        ctx.stroke();

        if (color) this.canvasFilters.color(ctx, canvas, color, 1.7)

        ctx.beginPath();
        ctx.arc(1476, 286, 242, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, 1476-250, 286-250, 450 + 50, 450 + 50);

        ctx.restore()
        
        // Infos
        ctx.fillStyle = 'black'
        ctx.font = `bold 90px Arial`;
        await this.fillWithEmoji(ctx, user.username.substring(0, 10), 369.5-(ctx.measureText(user.username.substring(0, 11)).width/2), 170)
    
        ctx.font = `bold 45px Arial`;
        ctx.fillStyle = 'black';
        ctx.fillText(user.id, 369.5-(ctx.measureText(user.id).width/2), 264)
    
        ctx.font = `bold 65px Arial`;
        ctx.fillText(`Rank: ${rank || '?'}°`, 886-(ctx.measureText(`Rank: ${rank || '?'}°`).width/2), 235)
    
        ctx.font = `bold 80px Arial`;
        ctx.fillText(result ? result.level : '?', 1136-(ctx.measureText(result ? result.level : '?').width/2), 430)
    
        ctx.font = `bold 60px Arial`;
        ctx.fillStyle = 'black';
        ctx.fillText(`${result ? result.xp : '?'} / ${result ? requiredXP : '?'}`, 556.5-(ctx.measureText(`${result ? result.xp : '?'} / ${result ? requiredXP : '?'}`).width/2), 430)
    
        // Badges
        let X = 712
        let result1 = await client.schemas['user'].find().sort([['bank', 'descending']]).limit(1)
        let result2 = await client.schemas['user'].find().sort([['commandsCounter', 'descending']]).limit(1)
        let result3 = await client.schemas['user'].find().sort([['voteCounter', 'descending']]).limit(1)
        let result4 = await client.schemas['user'].find().sort([['magicstones', 'descending']]).limit(1)
        let result5 = await client.schemas['user'].find().sort([['RPGPlayer.totalXP', 'descending']]).limit(1)

        async function drawBadge(link) {
            ctx.drawImage(await Canvas.loadImage(link), X, 70, 70, 70);
            X += 80
        }
        
        if (result1[0]._id == user.id) await drawBadge(Badges[10].link)
        if (result2[0]._id == user.id) await drawBadge(Badges[10].link)
        if (result3[0]._id == user.id) await drawBadge(Badges[10].link)
        if (result4[0]._id == user.id) await drawBadge(Badges[10].link)
        if (result5[0]._id == user.id) await drawBadge(Badges[10].link)
        if (config.owners.includes(user.id)) await drawBadge(Badges[0].link)
    
        return canvas.toBuffer();
    }
    
    async shipImage(avatar1, avatar2, name1, name2, percent, background) {
        const canvas = Canvas.createCanvas(1000, 480);
        const ctx = canvas.getContext('2d');
    
        const backgroundCanvas = await Canvas.loadImage(`./scripts/structures/functions/canvas/images/ship/ship_${background}.png`)
        ctx.drawImage(backgroundCanvas, 0, 0, canvas.width, canvas.height)
    
        const imageUser1 = await Canvas.loadImage(avatar1)
        ctx.drawImage(imageUser1, 10, 10, 300, 300)
        ctx.font = `bold 40px Arial`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = "start";
        await this.fillWithEmoji(ctx, name1.substring(0, 13), 150-(ctx.measureText(name1.substring(0, 13)).width/2)+10, canvas.height-75)
        
        const imageUser2 = await Canvas.loadImage(avatar2)
        ctx.drawImage(imageUser2, canvas.width-(300+10), 10, 300, 300)
        await this.fillWithEmoji(ctx, name2.substring(0, 13), canvas.width-(150+10)-(ctx.measureText(name2.substring(0, 13)).width/2), canvas.height-75)
    
        ctx.fill();
        ctx.fillStyle = '#363636';
        ctx.fillRect(500-(300/2), canvas.height-65, 300, 40);
        ctx.fillStyle = '#FF0000'
        ctx.fillRect(500-(300/2), canvas.height-65, percent*300, 40);
        ctx.fill();
        ctx.font = `bold 40px Arial`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = "start";
        ctx.fillText(`${Number.parseInt(percent*100)}%`, 500-(ctx.measureText(`${Number.parseInt(percent*100)}%`).width/2), canvas.height-75)
        ctx.fill();
    
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(500-(300/2), canvas.height-65, 300, 40);
    
        return canvas.toBuffer();
    }

    async metadinha(users) {
        const canvas = Canvas.createCanvas(600*users.length, 600);
        const ctx = canvas.getContext('2d');

        let X = 0
        for (let i in users) {
            const avatarImage = await Canvas.loadImage(users[i].avatarURL({ format: "png", size: 2048 }) || users[i].defaultAvatarURL)
            ctx.drawImage(avatarImage, X, 0, 600, 600)
            X += 600
        }

        return canvas.toBuffer();
    }

    async RPGPlayerStatus(player) {
        const canvas = Canvas.createCanvas(500, 150);
        const ctx = canvas.getContext('2d');

        const backgroundCanvas = await Canvas.loadImage(`https://cdn.discordapp.com/attachments/784557596580904981/983919132330315786/unknown.png`)
        ctx.drawImage(backgroundCanvas, 0, 0, canvas.width, canvas.height)

        // VIDA

        ctx.fillStyle = 'brown'
        ctx.fillRect(50, 10, 300, 40);
        ctx.fillStyle = 'gold'
        ctx.fillRect(50, 10, (player.life/player.totalLife)*300, 40);

        ctx.font = `bold 20px Arial`;
        ctx.fillStyle = 'black';
        ctx.fillText(`${player.life}/${player.totalLife}`, 50+5, 39)
        ctx.fillText(`${Number.parseInt(player.life/player.totalLife*100)}%`, 50+300-5-(ctx.measureText(`${Number.parseInt(player.life/player.totalLife*100)}%`).width), 39)
        
        //MANA

        ctx.fillStyle = 'brown'
        ctx.fillRect(50, 60, 300, 40);
        ctx.fillStyle = 'gold'
        ctx.fillRect(50, 60, (player.mana/player.totalMana)*300, 40);

        ctx.font = `bold 20px Arial`;
        ctx.fillStyle = 'black';
        ctx.fillText(`${player.mana}/${player.totalMana}`, 50+5, 89)
        ctx.fillText(`${Number.parseInt(player.mana/player.totalMana*100)}%`, 50+300-5-(ctx.measureText(`${Number.parseInt(player.mana/player.totalMana*100)}%`).width), 89)

        //ATAQUE

        ctx.font = `bold 30px Arial`;
        ctx.fillStyle = 'white';
        ctx.fillText(player.attack, 50+5, 140)

        return canvas.toBuffer();
    }

    async triggered(img) {
        const triggeredImage = await Canvas.loadImage('./scripts/structures/functions/canvas/images/triggered.png');
        const userAvatar = await Canvas.loadImage(img);
        const GIF = new GIFEncoder(256, 310);
        GIF.start();
        GIF.setRepeat(0);
        GIF.setDelay(15);
        const canvas = Canvas.createCanvas(GIF.width, GIF.height);
        const ctx = canvas.getContext("2d");

        const AR = 30;
        const TR = 20;

        for (let i = 0;i < 9;i++) {
            ctx.clearRect(0, 0, GIF.width, GIF.height);
            ctx.drawImage(
                userAvatar,
                Math.floor(Math.random() * AR) - AR,
                Math.floor(Math.random() * AR) - AR,
                GIF.width + AR,
                GIF.width*(userAvatar.height/userAvatar.width) + AR
            );
            ctx.fillStyle = "#FF000033";
            ctx.fillRect(0, 0, GIF.width, GIF.height);
            ctx.drawImage(
                triggeredImage,
                Math.floor(Math.random() * TR) - TR,
                GIF.width*(userAvatar.height/userAvatar.width) + Math.floor(Math.random() * TR) - TR,
                GIF.width + TR,
                54 + TR
            );
            GIF.addFrame(ctx);
            i++;
        }

        GIF.finish();
        return GIF.out.getData()
    }

    async trash(img) {
        const background = await Canvas.loadImage('./scripts/structures/functions/canvas/images/trash.png');
        const userAvatar = await Canvas.loadImage(img)

        const canvas = Canvas.createCanvas(background.width, background.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(userAvatar, canvas.width/2, 0, canvas.width/2, canvas.height/2)

        return canvas.toBuffer();
    }

    async gif() {
        //https://media4.giphy.com/media/DaOxkQ7wSPrCaiJFuV/giphy.gif
        let imageInfo = await this.getImageInfo('https://media4.giphy.com/media/DaOxkQ7wSPrCaiJFuV/giphy.gif')

        const GIF = new GIFEncoder(imageInfo.width, imageInfo.height);
        
        GIF.start();
        GIF.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        GIF.setDelay(imageInfo.delay);  // frame delay in ms
        //GIF.setQuality(); // image quality. 10 is default.
        
        // use node-canvas
        const canvas = Canvas.createCanvas(imageInfo.width, imageInfo.height);
        const ctx = canvas.getContext('2d');

        let total = imageInfo.frames.length
        let loaded = 0
        for (let i in imageInfo.frames) {
            let image = imageInfo.frames[i]
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            GIF.addFrame(ctx);

            loaded += 1
            console.log(`Loading: ${Number.parseInt(loaded/total*100)}%`)
        }

        GIF.finish();
        return GIF.out.getData()
    }

    async getImageInfo(url) {
        let imageInfo = {
            width: 0,
            height: 0,
            delay: 0,
            frames: []
        }

        await gifFrames({ url, frames: 'all', cumulative: true }).then((framesData) => framesData.forEach(async (frameData) => {
            imageInfo.width = frameData.frameInfo.width
            imageInfo.height = frameData.frameInfo.height
            imageInfo.delay = frameData.frameInfo.delay
            imageInfo.frames.push(await Canvas.loadImage(frameData.getImage()?._obj))            
            //imageInfo.frames.push(frameData.getImage()?._obj)
        }))

        return imageInfo
    }
}