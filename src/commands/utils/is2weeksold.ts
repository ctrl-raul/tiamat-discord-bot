import { CommandModule } from '../../CommandsManager';

const matchMsgID = /\d{18}$/;

const command: CommandModule = {

  enabled: false,

  async execute ({ msg, args }) {

    const match = args.match(matchMsgID) as RegExpMatchArray;
    const argumentMsgID = match[0];
    const argumentMsg = await msg.channel.messages.fetch(argumentMsgID);

    msg.channel.send(argumentMsg.createdTimestamp <= Date.now() - 1209600000);
  }

};

export default command;
