import embedLink from '../../utils/embedLink';
import { CommandModule } from '../../libs/DiscordCommandsManager';


const command: CommandModule = {

  // Alex should add link to the
  // guidelines in the rules channel
  enabled: false,

  execute (args) {

    const { msg, onError } = args;

    const embed = embedLink(
      'Guidelines',
      'https://community.supermechs.com/guidelines/',
      '#161219',
      args
    );

    msg.channel.send(embed).catch(onError);
    msg.delete().catch();

  }

};


export default command;
