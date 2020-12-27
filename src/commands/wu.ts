import { MessageEmbed } from 'discord.js';
import { CommandModule } from '../libs/DiscordCommandsManager';


const command: CommandModule = {

  disabled: true,

  execute ({ msg, cmd, prefix, onError }) {

    const replyLines = [
      'https://workshop-unlimited.vercel.app/',
      '\u200b',
      prefix + cmd.name + ' requested by <@' + msg.author.id + '>'
    ];

    const embed = new MessageEmbed()
      .setColor('#06222a')
      .addField('Workshop Unlimited', replyLines.join('\n'))

    msg.channel.send(embed).catch(onError)
    msg.delete().catch();

  }

};


export default command;
