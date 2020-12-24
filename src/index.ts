import Discord from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import discordCMDM from './DiscordCommandsManager';


dotenv.config();


const client = new Discord.Client();
const targets = env('TARGET_USER_IDS').split(' ');
const app = express();
const CMDM = discordCMDM('+', path.join(__dirname, './commands'));

const matchFrog = /f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i;


client.on('message', async msg => {

  if (msg.author.bot) {
    return;
  }

  if (targets.includes(msg.author.id) || matchFrog.test(msg.content)) {
    try {
      await msg.react('<:frog1:790563843088711700>');
      await msg.react('🚿');
    } catch (err) {}
  }

  if (await CMDM.evaluate(msg)) {
    return;
  }

  // Do something here if it's not a command?
});

client.login(env('TOKEN'));

app.listen(env('PORT', '3000'));

app.get('/', (_, res) => {
  res.send('Where are you going?');
});


function env (name: string, defaultValue?: string): string {
  
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (typeof defaultValue === 'string') {
    return defaultValue;
  }

  throw new TypeError(`Missing process.env.${name}`);
}

console.log(CMDM.cmds);
console.log('Successfuly loaded', Object.keys(CMDM.cmds).length, 'command(s)!');
