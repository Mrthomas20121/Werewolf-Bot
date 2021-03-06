const shuffle = require('./utils/shuffle')
const Sweetcord = require('sweetcord')
const config = require('./config/config')
const fs = require('fs');
const Werewolf = require('./werewolf_app')


const builder = require('./config/helpBuilder')
// file used to auth the bot, contain the bot token
const auth = require('./auth.json')
// command and their description
const help = require('./config/help')
// role and their description.
const roles = require('./role/role.json')

// array of userID
let usersID = [];
// role array
let role = [];
// emotes used by the bot, mostly error and success emotes.
let emotes = {
	error:'<:error:444107855822454786>',
	success: '<:checkmark:444107855986032660>'
}
// dead users array, it's used to tell the bot which users died in the game.
let dead_users = [];

// daytime variable, used to determine if it's daytime or not
let daytime = true;

// Initialize Discord Bot
const bot = new Sweetcord.SweetClient({
	token: auth.token,
	autorun: true,
	prefix:config.prefix
});

bot.on('ready', function(event) {
	// send a message in the chat when the bot is ready
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
    bot.setPresence({
        game: {
            name: `the sound of silence || ${bot.prefix}help`,
            type: '2', // type '2' is listenning to
            url: null // not setting a url
		}
	});
		// check every 5s if there anyone dead.
		setInterval(() => {
			if( (usersID.length < 0 && dead_users.length < 0) && (daytime) ) {
				for (const dead of dead_users) {
					bot.addToRole({
						serverID: server.serverID,
						userID: dead,
						roleID: '335458298369146891'
					});
					bot.sendMessage({
						to:config.role_channels.daytime,
						message:`${bot.servers[serverID].members[dead]} was killed last night`
					});
				}
			}
		}, 5000);
});

// message listenner
bot.on('message', function (user, userID, channelID, message, event) {
if (message.startsWith(bot.prefix)) {
	let args = message.slice(config.prefix.length).split(' ');
	let command = args[0];

	if(command == help.commands[0].name) {
		bot.sendMessage({
			to:channelID,
			message:help.commands[0].text
		});
	}
	else if(command == help.commands[3].name) {
		// werewolf decide who they want to kill
	if(args.length > 0) {
		let username = args[1];
		const u = Object.values(bot.servers[server.serverID].members);
		const obj = u.find((u) => u.username === username);

		// add the user to the dead user array
		dead_users.push(obj.id);
		dead = obj.id;
		}
	}
	else if(command == 'perm') {
		
		bot.editChannelPermissions({
			channelID:channelID,
			userID:'408569903000453120',
			deny:[Discord.Permissions.TEXT_SEND_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGE_HISTORY, Discord.Permissions.TEXT_ADD_REACTIONS]
		}, (err) => {
			if(err) throw err;
		});
	}
	else if(command == 'dead') {
		if (event.d.mentions.length == 1)  {
		bot.addToRole({
			serverID: server.serverID,
			userID: event.d.mentions[0].id,
			roleID: '335458298369146891'
		});
		bot.sendMessage({
				to: channelID,
				message: event.d.mentions[0].username + ' was killed'
			});
		}
	}
	else if(command == 'reset') {
		let role = '333353928643313664';
		if (bot.servers[bot.channels[channelID].guild_id].members[userID].roles.includes(role)){
			if(event.d.mentions.length == 0) return;
			else if(event.d.mentions.length == 1) {
				bot.removeFromRole({
					serverID: server.serverID,
					userID: event.d.mentions[i].id,
					roleID: '333352501258485760'
				});
			}
			else {
				for (var i = 0; i<event.d.mentions.length; i++) {
					bot.removeFromRole({
						serverID: server.serverID,
						userID: event.d.mentions[i].id,
						roleID: '333352501258485760'
					});
				}
			}
		}
		else {
			bot.sendMessage({
				to:channelID,
				message:`${emotes.error} you don\'t have permission to use this command`
			}, (err, res) => {
				if(err) {
					throw err;
				}
				setTimeout(() => {
					bot.deleteMessage({
						channelID:channelID,
						messageID:res.id
					});
				}, 10000);
			});
		}
	}
	else if(command == 'help') {
		bot.sendMessage(builder.Show(channelID, config.prefix));
	}
	else if(command == 'role') {
		if(args.length == 1){
			bot.sendMessage({
				to: channelID,
				embed: {
					title: 'Roles',
					description : '',
					color: 0x00b4fa,
					fields: [
						{
							name : 'Werewolf',
							value : roles.werewolf.desc,
							inline : true
						},
						{
							name : 'Hunter',
							value : roles.hunter.desc,
							inline : true
						},
						{
							name : 'Witch',
							value : roles.witch.desc,
							inline : true
						},
						{
							name : 'Healer',
							value : roles.healer.desc,
							inline : true
						},
						{
							name : 'Oracle',
							value : roles.oracle.desc,
							inline : true
						},
						{
							name : 'Amor',
							value : roles.amor.desc,
							inline : true
						},
						{
							name : 'Spy',
							value : roles.spy.desc,
							inline : true
						},
						{
							name : 'Lone wolf',
							value : roles.lonewolf.desc,
							inline : true
						},
						{
							name : 'Vilager',
							value : roles.villager.desc,
							inline : true
						},
					]
				}             
			});
		}
		else if(typeof roles[args[1]] !== 'undefined') {
			bot.sendMessage({
				to:channelID,
				message:`**${args[1].toUpperCase()} :** \n${roles[args[1]].desc}`
			});
		}
		else {
			bot.sendMessage({
				to:channelID,
				message:`<:error:444107855822454786> ${args[1]} is not a valid role. use ${config.prefix}role *without args* to see all roles`
			}, (err, res) => {
				if(err) throw err;
				setTimeout(() => {
					bot.deleteMessage({
						channelID:channelID,
						messageID:res.id
					});
				}, 10000);
			});
		}
	}
	else if(command == 'start') {
		for(var i = 0; i<event.d.mentions.length; i++) {
			usersID[i] = event.d.mentions[i].id;
		}
		role = ['witch', 'hunter', 'villager', 'werewolf', 'oracle', 'werewolf'];
		if(usersID.length == 0) return;
		else if(usersID.length == 21) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('hunter');
			role.push('amor');
			role.push('healer');
			role.push('villager');
			role.push('villager');
			role.push('werewolf');
			role.push('villager');
			role.push('villager');
			role.push('villager');
			role.push('villager');
			role.push('werewolf');
		}
		else if(usersID.length == 20) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');
			role.push('villager');
			role.push('villager');
			role.push('werewolf');
			role.push('hunter');
			role.push('villager');
			role.push('villager');
			role.push('villager');
		}
		else if(usersID.length == 19) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');
			role.push('villager');
			role.push('villager');
			role.push('werewolf');
			role.push('hunter');
			role.push('villager');
			role.push('werewolf');
		}
		else if(usersID.length == 18) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');
			role.push('villager');
			role.push('villager');
			role.push('werewolf');
			role.push('villager');
		}
		else if(usersID.length == 17) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');
			role.push('villager');
			role.push('villager');
			role.push('villager');
			role.push('hunter');
		}
		else if(usersID.length == 16) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');
			role.push('villager');
			role.push('villager');
			role.push('hunter');
		}
		else if(usersID.length == 15) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');
			role.push('villager');
			role.push('villager');
		}
		else if(usersID.length == 14) {
			role.push('villager');
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');			
		}
		else if(usersID.length == 13) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
			role.push('healer');			
		}
		else if(usersID.length == 12) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
			role.push('amor');
		}
		else if(usersID.length == 11) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
			role.push('villager');
		}
		else if(usersID.length == 10) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('werewolf');
			role.push('spy');
		}
		else if(usersID.length == 9) {
			role.push('lone wolf');
			role.push('werewolf');
			role.push('spy');
		}
		else if(usersID.length == 8) {
			role.push('lone wolf');
			role.push('werewolf');
		}
		else if(usersID.length == 7) {
			role.push('lone wolf');
		}
		else if(usersID.length == 6) {
			role = ['witch', 'hunter', 'villager', 'werewolf', 'oracle', 'werewolf'];
		}
		// console.log(shuffle(role));
		let shuffledRoles = shuffle(role);
		
		let val = '';
		let grabiID = '198780988959096832';
		let obj = [];
		for(let i = 0; i<shuffledRoles.length; i++) {
			bot.sendMessage({
				to: usersID[i],
				message: `Your (new)role is : ${shuffledRoles[i]}\ndon't tell anyone what your role is.`
			});

			obj.push({
				user: usersID[i],
				role: shuffledRoles[i]
			});

			fs.writeFileSync('./werewolf_data.json', JSON.stringify(obj));

			switch(shuffledRoles[i]) {
				case 'werewolf':
				case 'spy':
				case 'lone wolf':
				bot.editChannelPermissions({
					channelID:config.role_channels.werewolves,
					userID: usersID[i],
					allow:[Discord.Permissions.TEXT_SEND_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGE_HISTORY, Discord.Permissions.TEXT_ADD_REACTIONS]
				}, (err) => {
					if(err) throw err;
				});
				break;
				case 'witch':
				bot.editChannelPermissions({
					channelID:config.role_channels.witch,
					userID: usersID[i],
					allow:[Discord.Permissions.TEXT_SEND_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGE_HISTORY, Discord.Permissions.TEXT_ADD_REACTIONS]
				}, (err) => {
					if(err) throw err;
				});
				break;
				case 'oracle':
				bot.editChannelPermissions({
					channelID:config.role_channels.oracle,
					userID: usersID[i],
					allow:[Discord.Permissions.TEXT_SEND_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGE_HISTORY, Discord.Permissions.TEXT_ADD_REACTIONS]
				}, (err) => {
					if(err) throw err;
				});
				break;
				case 'hunter':

				break;
				case 'amor':
				bot.editChannelPermissions({
					channelID:config.role_channels.amor,
					userID: usersID[i],
					allow:[Discord.Permissions.TEXT_SEND_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGES, Discord.Permissions.TEXT_READ_MESSAGE_HISTORY, Discord.Permissions.TEXT_ADD_REACTIONS]
				}, (err) => {
					if(err) throw err;
				});
				break;
				case 'healer':
				case 'villager':
				default:
				// it's a villager or healer
				break;
			}
			let u = usersID[i];
			val+=`${bot.users[u].username} : ${r[i]}\n`
		}
			bot.sendMessage({
				to:grabiID,
				message:val
			});
		}
	}
});

bot.on('disconnect', function(errMsg, code) {
  bot.connect();
});