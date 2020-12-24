import Discord from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';


dotenv.config();


const client = new Discord.Client();
const targets = env('TARGET_USER_IDS').split(' ');
const app = express();

const matchFrog = /f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i;


client.on('message', async msg => {
  const frogIt = targets.includes(msg.author.id) || matchFrog.test(msg.content);
  if (frogIt) {
    try {
      await msg.react('<:frog1:790563843088711700>');
      await msg.react('🚿');
    } catch (err) {
      console.error('Failed to frog it :(')
    }
  }
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
