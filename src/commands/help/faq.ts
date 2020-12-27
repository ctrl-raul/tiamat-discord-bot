import embedLink from '../../utils/embedLink';
import { CommandModule } from '../../libs/DiscordCommandsManager';


const command: CommandModule = {

  execute (args) {

    const { msg, onError } = args;

    const embed = embedLink(
      'Frequently Asked Questions',
      'https://community.supermechs.com/knowledgebase/faq/',
      '#161219',
      args
    );

    msg.channel.send(embed).catch(onError);
    msg.delete().catch();

  }

};


export default command;
