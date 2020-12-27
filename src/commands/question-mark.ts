import { CommandModule } from '../libs/DiscordCommandsManager';

const command: CommandModule = {

  name: '?',

  execute ({ msg, args, onError }) {
    if (args.length) {
      const reply = '```json\n' + JSON.stringify({ args }, null, 2) + '\n```';
      msg.channel.send(reply).catch(onError);
    } else {
      msg.react('❗').catch(onError);
    }
  }

};

export default command;
