const { create, all } = require('mathjs');

module.exports = (client, app) => {
	const math = create(all);
	math.import({
		'apply': () => this.events.commands.deactivated,
		'column': () => this.events.commands.deactivated,
		'concat': () => this.events.commands.deactivated,
		'cross': () => this.events.commands.deactivated,
		'ctranspose': () => this.events.commands.deactivated,
		'det': () => this.events.commands.deactivated,
		'diag': () => this.events.commands.deactivated,
		'diff': () => this.events.commands.deactivated,
		'dot': () => this.events.commands.deactivated,
		'eigs': () => this.events.commands.deactivated,
		'expm': () => this.events.commands.deactivated,
		'filter': () => this.events.commands.deactivated,
		'flatten': () => this.events.commands.deactivated,
		'forEach': () => this.events.commands.deactivated,
		'getMatrixDataType': () => this.events.commands.deactivated,
		'identity': () => this.events.commands.deactivated,
		'inv': () => this.events.commands.deactivated,
		'kron': () => this.events.commands.deactivated,
		'map': () => this.events.commands.deactivated,
		'ones': () => this.events.commands.deactivated,
		'partitionSelect': () => this.events.commands.deactivated,
		'range': () => this.events.commands.deactivated,
		'reshape': () => this.events.commands.deactivated,
		'resize': () => this.events.commands.deactivated,
		'rotate': () => this.events.commands.deactivated,
		'rotationMatrix': () => this.events.commands.deactivated,
		'row': () => this.events.commands.deactivated,
		'size': () => this.events.commands.deactivated,
		'sort': () => this.events.commands.deactivated,
		'sqrtm': () => this.events.commands.deactivated,
		'squeeze': () => this.events.commands.deactivated,
		'subset': () => this.events.commands.deactivated,
		'trace': () => this.events.commands.deactivated,
		'transpose': () => this.events.commands.deactivated,
		'zeros': () => this.events.commands.deactivated,
	}, { override: true });
	client.math = math

	client.moment = require('moment-timezone');
	client.moment.locale('pt-BR');
	client.moment.tz.setDefault('America/Brazil');

	client.app = app
	client.functions = new (require('./functions/index'))
	client.functions.client = client

	client.YTLastVideos = []
	client.TWLastLives = []
	
	client.commands = {};
	client.slashCommands = {};
	client.queues = new Map();
	client.schemas = {};
	client.usersDelay = {};
	client.rankUsersDelay = {};
	client.userCommand = {};
	client.userRPG = {};
}