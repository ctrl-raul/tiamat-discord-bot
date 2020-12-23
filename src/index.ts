import Discord from 'discord.js';
import dotenv from 'dotenv';


dotenv.config();


const client = new Discord.Client();
const targets = env('TARGET_USER_IDS').split(' ');


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


function env (name: string): string {
  const value = process.env[name];
  if (value) {
    return value;
  }
  throw new TypeError(`Missing process.env.${name}`);
}
