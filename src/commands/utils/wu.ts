import embedLink from '../../utils/embedLink';
import { CommandModule } from '../../libs/DiscordCommandsManager';


const command: CommandModule = {

  execute (args) {

    const { msg, onError } = args;

    const embed = embedLink(
      'Workshop Unlimited',
      'https://workshop-unlimited.vercel.app/',
      '#06222a',
      args
    );

    msg.channel.send(embed).catch(onError)
    msg.delete().catch();

  }

};


export default command;
