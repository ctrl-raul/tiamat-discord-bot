import { CommandModule } from '../../libs/DiscordCommandsManager';

// TODO: Keep pins
// TODO: Delete messages from specific users

const matchUintAtStart = /^\d+(?=(\s|$))/;

const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg, args, onError }) {

    if (msg.channel.type === 'dm') {
      msg.channel.send('Can not purge in DMs.').catch();
      return;
    }

    let limit = 2;

    if (args.length) {
      const match = args.match(matchUintAtStart);
      if (match) {
        limit = 1 + Math.min(99, Number(match[0]) || 1);
      } else {
        msg.react('❌').catch();
        return;
      }
    }

    try {
      const msgsToDelete = await msg.channel.messages.fetch({ limit });
      await msg.channel.bulkDelete(msgsToDelete);
    } catch(err) {
      onError(err);
    }
  }

};


export default command;
