import { CommandModule } from '../CommandsManager';

const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  execute ({ msg, onError }) {
    msg.channel.send('If you keep behaving like that, you can PM <@336988655748907008> to remove your balls.')
      .catch(onError);
  }

};

export default command;
