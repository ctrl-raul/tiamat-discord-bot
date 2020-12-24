import Discord, { PermissionString } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';


dotenv.config();


const client = new Discord.Client();
const targets = env('TARGET_USER_IDS').split(' ');
const app = express();

const matchFrog = /f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i;


client.on('message', async msg => {

  if (msg.author.bot) {
    return;
  }

  if ((/^\+faq/i).test(msg.content)) {
    try {
      await msg.delete();
      await msg.channel.send(
        new Discord.MessageEmbed()
          .setColor('#161219')
          .setTitle('Frequently Asked Questions')
          .setDescription('https://community.supermechs.com/knowledgebase/faq/')
          .setFooter('+faq requested by ' + msg.author.tag)
      );
    } catch (err) {
      console.log('Failed to send FAQ link:', err.message);
    }
    return;
  }

  if (msg.member) {
    if (hasPermissions(msg.member.permissions, ['MANAGE_MESSAGES'])) {
      if ((/^\+base/i).test(msg.content)) {
        try {
          await msg.channel.send('Send a private message to <@336988655748907008> to remove your base.');
        } catch (err) {}
        return;
      }
    
      if ((/^\+balls/i).test(msg.content)) {
        try {
          await msg.channel.send('If you keep behaving like that, you can PM <@336988655748907008> to remove your balls.');
        } catch (err) {}
        return;
      }
    }
  }
  

  if (targets.includes(msg.author.id) || matchFrog.test(msg.content)) {
    try {
      await msg.react('<:frog1:790563843088711700>');
      await msg.react('🚿');
    } catch (err) {}
  }
});

client.login(env('TOKEN'));

app.listen(env('PORT', '3000'));

app.get('/', (_, res) => {
  res.send('Where are you going?');
});


function hasPermissions (permissions: Readonly<Discord.Permissions>, required: PermissionString[]) {
	for (let x of required) {
    if (permissions.has(x)) {
      return true;
    }
  }
	return false;
}

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
