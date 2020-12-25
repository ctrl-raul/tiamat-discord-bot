import { MessageEmbed } from 'discord.js';
import { CommandModule } from '../DiscordCommandsManager';

export default {

  name: 'faq',

  permissions: [],

  async execute ({ msg, cmd }) {
    try {
      await msg.delete();
      await msg.channel.send(
        new MessageEmbed()
          .setColor('#161219')
          .setTitle('Frequently Asked Questions')
          .setDescription('https://community.supermechs.com/knowledgebase/faq/')
          .setFooter(`+${cmd.name} requested by ${msg.author.tag}`)
      );
      return true;
    } catch (err) {
      return false;
    }
  }

} as CommandModule;
