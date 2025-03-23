const request = require('node-superfetch')

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(channelId) {
        const result = await request.get(`https://www.youtube.com/channel/${channelId}`).catch(() => null)
        if (!result) return null
        let info = JSON.parse(result.text.split('ytInitialData =')[1].split('</script>')[0].replace(/[;]/g, ''))
        return info.metadata.channelMetadataRenderer || null
    }
}