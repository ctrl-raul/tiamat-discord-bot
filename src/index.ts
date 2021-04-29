import Discord from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import BullyingManager from './misc/BullyingManager';
import discordCMDM from './libs/DiscordCommandsManager';
// import disableBaseTip from './misc/disableBaseTip';
import env from './utils/env';


dotenv.config();


const PREFIX_PROD = '+';
const PREFIX_DEV = '-';
const PREFIX = env('LOCALLY', 'false') === 'true' ? PREFIX_DEV : PREFIX_PROD;
const matchFrog = /f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i; // Matches variants of "frog" or "grenouille" (French for frog)

const client = new Discord.Client();
const CMDM = discordCMDM(PREFIX, path.join(__dirname, './commands'), true);
const matchKillin = /k+i+l+i+n+(?!g)/i;


init();


function onReady () {

  if (!client.user) {
    return;
  }

  client.user.setPresence({
    status: 'dnd',

    activity: {
      name: 'prefix: ' + PREFIX_PROD
    }
  });

  client.user.setUsername('Tiamat');

  console.log(`Logged in as ${client.user.tag}!`);

}

async function onMessage (msg: Discord.Message): Promise<void> {

  // Ignore messages from bots
  if (msg.author.bot) {
    return;
  }

  if (msg.channel.type === 'dm' && msg.author.id !== client.user?.id) {
    msg.channel.send(`I don't like DMs.`);
  }

  if (matchFrog.test(msg.content)) {
    msg.react('<:frog1:790563843088711700>').catch();
  }

  if (matchKillin.test(msg.content)) {
    await msg.react('<:hacker:793643471084847144>');
  }

  // disableBaseTip(msg);
  BullyingManager.evaluate(msg);
  CMDM.evaluate(msg);
}

function init () {

  const commandNames = Object.keys(CMDM.cmds);

  client.on('ready', onReady);
  client.on('message', onMessage);
  client.login(env('TOKEN'));

  console.log('Successfuly loaded', commandNames.length, 'command(s)!');
  console.log(commandNames);

}
