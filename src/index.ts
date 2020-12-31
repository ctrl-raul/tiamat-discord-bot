import Discord from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import discordCMDM from './libs/DiscordCommandsManager';
import disableBaseTip from './misc/disableBaseTip';
import env from './utils/env';


dotenv.config();


const PREFIX_PROD = '+';
const PREFIX_DEV = '-';
const PREFIX = env('LOCALLY', 'false') === 'true' ? PREFIX_DEV : PREFIX_PROD;
const matchFrog = /f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i; // Matches variants of "frog" or "grenouille" (French for frog)

const client = new Discord.Client();
const app = express();
const CMDM = discordCMDM(PREFIX, path.join(__dirname, './commands'), true);
const froggerID = '219091519590629376';
const turtlerID = '713530503331840051';
const matchKillin = /i+ll+i+n+(?!g)/i || /k+i+l+i+n+/i;


init();


function onReady () {

  if (!client.user) {
    return;
  }

  client.user.setPresence({
    status: 'online',
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

  if (
    (msg.author.id === froggerID && Math.random() > 0.5)
    || matchFrog.test(msg.content)
  ) {
    try {
      await msg.react('<:frog1:790563843088711700>');
      await msg.react('🚿');
    } catch (err) {
      console.error('Failed to react with frog:', err);
    }
  }

  if (msg.author.id === turtlerID && Math.random() > 0.95) {
    try {
      await msg.react('🐢');
    } catch (err) {
      console.error('Failed to react with turtle:', err);
    }
  }

  if (matchKillin.test(msg.content)) {
    try {
      await msg.react('<:hacker:793643471084847144>');
    } catch (err) {
      console.error('Failed to react with hacker:', err);
    }
  }

  disableBaseTip(msg);
  CMDM.evaluate(msg);
}

function init () {

  const PORT = env('PORT', '3000');
  const commandNames = Object.keys(CMDM.cmds);

  client.on('ready', onReady);
  client.on('message', onMessage);
  client.login(env('TOKEN'));
  
  app.listen(PORT, () => console.log('Listening on port', PORT));
  app.get('/', (_, res) => res.send('Where are you going?'));

  console.log('Successfuly loaded', commandNames.length, 'command(s)!');
  console.log(commandNames);
}
