import { CommandModule } from '../../libs/DiscordCommandsManager';
import BullyingManager from '../../BullyingManager';


const matchSyntax = /<@!(\d+)>\s+(.+)\s+(\d+)/;


const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg, args }) {

    console.log(args);

    const match = args.match(matchSyntax);

    if (!match) {
      msg.react('❌');
      return;
    };

    const [_, userID, emojiID, procent] = match;
    const ratio = Number(procent) / 100;

    if (ratio > 0) {

      try {

        await msg.react(emojiID);

        const { error } = BullyingManager.addReaction(userID, ratio, emojiID);

        if (error) {
          msg.author.send(error).catch();
        } else {
          // Everything done right, yay!
        }

      } catch (err) {
        // For now we just assume the error is because it can't use the emoji #TODO
        msg.channel.send(`Aw <@!${msg.author.id}>, I can only use emojis from servers I'm in.`).then(m => {
          setTimeout(() => m.delete(), 3000);
        }).catch();
      }
      
    } else {
      BullyingManager.remReaction(userID, emojiID);
    }
  }

};


export default command;
