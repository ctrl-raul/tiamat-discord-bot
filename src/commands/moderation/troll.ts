import { CommandModule } from '../../libs/DiscordCommandsManager';
import BullyingManager from '../../BullyingManager';


// const matchSyntax = /<@!(\d+)>\s+(.+)\s+(\d+)/;


const regex_userMentionOrID = /<@!(\d{18})>|(\d{18})/;
const regex_emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|<:.+?:\d{18}>)/;

const syntax = [regex_userMentionOrID, regex_emoji, /(\d+)/];


const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg, args }) {

    if (args === 'data') {

      const lines = [
        '```json',
        JSON.stringify(BullyingManager.getData(), null, 2),
        '```',
      ];

      msg.channel.send(lines.join('\n'));
      return;
    }

    const words = args.split(' ');
    const validSyntax = syntax.every((token, i) => token.test(words[i]));

    // const match = args.match(matchSyntax);

    if (!validSyntax) {
      msg.react('❌');
      return;
    };

    const [userID, emojiID, procent] = syntax.map((token, i) => {
      const match = words[i].match(token) as RegExpMatchArray;
      return match[1];
    });

    const ratio = Number(procent) / 100;

    if (ratio > 0) {

      try {

        await msg.react(emojiID);

        const { error } = BullyingManager.addReaction(userID, ratio, emojiID);

        if (error) {
          msg.react('❌');
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
      const { error } = BullyingManager.remReaction(userID, emojiID);

      if (!error) {
        msg.react('✔️');
      } else {
        msg.channel.send(error).then(m => {
          setTimeout(() => m.delete(), 3000);
        }).catch();
      }
    }
  }

};


export default command;
