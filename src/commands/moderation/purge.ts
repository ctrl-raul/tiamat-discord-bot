import { CommandModule } from '../../libs/DiscordCommandsManager';


const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg, args, onError }) {

    // TODO: Keep pins
    // TODO: Delete messages from specific users

    if (msg.channel.type === 'dm') {
      msg.channel.send('Can not purge in DMs.');
      return;
    }

    const limit = 1 + Math.max(1, Math.min(100, Number(args.match(/^\d+/)) || 1));

    try {
      await msg.channel.bulkDelete(
        await msg.channel.messages.fetch({ limit })
      );
    } catch (err) {
      onError(err);
    }

  }

};


export default command;
