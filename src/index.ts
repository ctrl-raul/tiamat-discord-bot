import Discord from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import BullyingManager from './misc/BullyingManager';
import CommandsManager from './CommandsManager';
// import disableBaseTip from './misc/disableBaseTip';
import ReactToText from './misc/ReactToText';
import env from './utils/env';


dotenv.config();


const LOCALLY = env('LOCALLY', 'false');
const PREFIX_PROD = '+';
const PREFIX = LOCALLY ? '-' : PREFIX_PROD;


const client = new Discord.Client();
const reactToText = new ReactToText(client);
const commandsManager = new CommandsManager({
  prefix: PREFIX,
  commandsDir: path.join(__dirname, './commands'),
  onExecutingCommand: cmd => console.log(`Executing command '${cmd.name}'`),
  onCommandExecutionError: (cmd, err) => console.error(`Failed to execute command '${cmd.name}':`, err),
});


reactToText.add(/f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i, '<:frog1:790563843088711700>');
reactToText.add(/k+i+l+i+n+(?!g)/i, '<:hacker:793643471084847144>');

client.on('ready', () => {

  if (!client.user) return;

  client.user.setPresence({
    status: 'dnd',
    activity: {
      name: 'prefix: ' + PREFIX_PROD
    }
  }).catch();

  client.user.setUsername('Tiamat').catch();

  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('message', async msg => {

  // Ignore messages from bots
  if (msg.author.bot) return;

  if (msg.channel.type === 'dm' && msg.author.id !== client.user?.id) {
    msg.channel.send(`I don't like DMs.`).catch();
  }


  BullyingManager.evaluate(msg);
  const fail = commandsManager.evaluate(msg);

  if (fail !== null) {
    switch (fail.name) {
      case 'COMMAND_DISABLED':
      case 'MISSING_PERMISSIONS':
        msg.react('❌').catch();
        break;
      case 'PRIVATE_MESSAGE':
        msg.channel.send(`I don't like PMs`).catch();
        break;
    }
  }

});


client.login(env('TOKEN'));


{
  const commandNames = Object.keys(commandsManager.commands);

  console.log(`Running in ${LOCALLY ? 'dev' : 'prod'}. (prefix: ${PREFIX})`);
  console.log(`Successfuly loaded ${commandNames.length} commands:`);
  console.log(commandNames);
}
