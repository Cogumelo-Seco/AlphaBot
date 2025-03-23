module.exports = async (client, oldmessage, message) => {
    require('./messageCreate')(client, message)
}