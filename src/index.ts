import Discord from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';


dotenv.config();


const client = new Discord.Client();
const targets = env('TARGET_USER_IDS').split(' ');
const app = express();


client.on('message', async msg => {
  if (targets.includes(msg.author.id)) {
    try {
      await msg.react('🐸');
      await msg.react('🚿');
    } catch (err) {
      // cope
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
