import { MessageEmbed } from 'discord.js';
import { CommandModule } from '../libs/DiscordCommandsManager';


const command: CommandModule = {

  execute ({ msg, cmd, onError, prefix }) {

    const replyLines = [
      'https://community.supermechs.com/knowledgebase/faq/',
      '\u200b',
      prefix + cmd.name + ' requested by <@' + msg.author.id + '>'
    ];

    const embed = new MessageEmbed()
      .setColor('#161219')
      .addField('Frequently Asked Questions', replyLines.join('\n'))

    msg.channel.send(embed).catch(onError);
    msg.delete().catch();

  }

};


export default command;