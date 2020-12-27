import { CommandModule } from '../libs/DiscordCommandsManager';

const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  execute ({ msg, onError }) {
    msg.channel.send('Send a private message to <@336988655748907008> to remove your base.')
      .catch(onError);
  }

};

export default command;
