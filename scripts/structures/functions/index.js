class Functions {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    numberConverter = (props) => new (require('./numberConverter'))(this).run(props)
    buildHelpMessage = (...props) => new (require('./buildHelpMessage'))(this).run(props)
    randomAvatar = (...props) => new (require('./randomAvatar'))(this).run(props)
    formatTime = (...props) => new (require('./formatTime'))(this).run(props)
    formatDate = (...props) => new (require('./formatDate'))(this).run(props)
    getMcUser = (...props) => new (require('./getMcUser'))(this).run(props)
    getRbUser = (...props) => new (require('./getRbUser'))(this).run(props)
    getRbGame = (...props) => new (require('./getRbGame'))(this).run(props)
    badges = (...props) => new (require('./badges'))(this).run(props)
    textFile = (...props) => new (require('./textFile'))(this).run(props)
    replaces = (...props) => new (require('./replaces'))(this).run(props)
    fillWithEmoji = (...props) => new (require('./canvas/fillWithEmoji'))(this).run(props)
    playSong = (...props) => new (require('./playSong'))(this).run(props)
    getYTChannelInfo = (props) => new (require('./getYTChannelInfo'))(this).run(props)
    getYTVideoInfo = (props) => new (require('./getYTVideoInfo'))(this).run(props)
    YTNotify = (props) => new (require('./YTNotify'))(this).run(props)
    getTwitchChannelInfo = (props) => new (require('./getTwitchChannelInfo'))(this).run(props)
    getTwitchLiveInfo = (props) => new (require('./getTwitchLiveInfo'))(this).run(props)
    TWNotify = (props) => new (require('./TWNotify'))(this).run(props)
    verifyRPGPlayer = (props) => new (require('./verifyRPGPlayer'))(this).run(props)
    
    canvasFilters = new (require('./canvas/filters'))(this)
    canvasImages = new (require('./canvas/canvas'))(this)
    console = new (require('./console'))(this)
}

module.exports = Functions;