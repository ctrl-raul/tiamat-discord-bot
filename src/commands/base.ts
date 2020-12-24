import { CommandModule } from '../DiscordCommandsManager';

export default {

  name: 'base',

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg }) {
    try {
      await msg.channel.send('Send a private message to <@336988655748907008> to remove your base.');
      return true;
    } catch (err) {
      return false;
    }
  }

} as CommandModule;
