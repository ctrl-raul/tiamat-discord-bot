import Discord from 'discord.js';
import dotenv from 'dotenv';


const client = new Discord.Client();


dotenv.config();

client.on('message', msg => {
  if (msg.author && msg.author.id === "219091519590629376") {
    msg.react('🐸');
    msg.react('🚿');
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
