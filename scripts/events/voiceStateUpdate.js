module.exports = async (client, oldMember, newMember) => {
	if (newMember.id == client.user.id && newMember.channelID == null){
		const queue = client.queues.get(oldMember.guild.id);
		
		if (queue) {
			queue.connection.destroy()
        	client.queues.delete(oldMember.guild.id);
		}
	}
}