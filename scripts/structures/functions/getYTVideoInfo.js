const request = require('node-superfetch')

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(videoId) {
        const result = await request.get(`https://www.youtube.com/shorts/${videoId}`).catch(() => null)
        if (!result) return null
        let info = JSON.parse(result.text.split('ytInitialPlayerResponse =')[1].split('</script>')[0].replace(/[;]/g, ''))

        let shorts = (result.text.split('originalUrl":"')[1].split('"')[0])
        info.videoDetails.shorts = shorts.split('/')[shorts.split('/').length-2] == 'shorts'

        return info.videoDetails || null
    }
}