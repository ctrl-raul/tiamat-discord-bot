import { CommandModule } from '../DiscordCommandsManager';

export default {

  name: 'balls',

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg }) {
    try {
      await msg.channel.send('If you keep behaving like that, you can PM <@336988655748907008> to remove your balls.');
      return true;
    } catch (err) {
      return false;
    }
  }

} as CommandModule;
