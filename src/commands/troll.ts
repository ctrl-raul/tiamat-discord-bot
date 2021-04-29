import { CommandModule } from '../libs/DiscordCommandsManager';
import BullyingManager from '../misc/BullyingManager';


// const matchSyntax = /<@!(\d+)>\s+(.+)\s+(\d+)/;


const regex_userMention = /^<@!(\d+})>$/;
const regex_userID = /^(\d+})$/;
const regex_emoji = /^((?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,2})$/;
const regex_discordEmoji = /^(<\w?:\w+?:\d+}>)$/;

const syntax = [
  [regex_userMention, regex_userID],
  [regex_emoji, regex_discordEmoji],
  [/(\d+)/],
];


const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg, args }) {

    const words = args.split(' ');

    switch (words[0]) {

      case 'clear': {
        const { error } = BullyingManager.remUser(words[1]);

        if (!error) {
          msg.react('✔️');
        } else {
          msg.channel.send(error).then(m => {
            setTimeout(() => m.delete(), 3000);
          }).catch();
        }

        break;
      } 

      case 'data': {
        const lines = [
          '```json',
          JSON.stringify(BullyingManager.getData(), null, 2),
          '```',
        ];
  
        msg.channel.send(lines.join('\n'));
        break;
      }

      case 'setdata': {
        words.shift();
        const inputData = words.join('');
        const result = BullyingManager.setData(inputData);
        if (result && result.error) {
          msg.channel.send(result.error).catch();
        }
        break;
      }

      default: {
        const validSyntax = syntax.every((tokens, i) => {
          return tokens.some(token => token.test(words[i]));
        });
    
        if (!validSyntax) {
          msg.react('❌');
          msg.channel.send('Invalid syntax');
          return;
        };
    
        const [userID, emojiID, procent] = syntax.map((tokens, i) => {
    
          let match: RegExpMatchArray;
    
          for (let j = 0; j < tokens.length; j++) {
            match = words[i].match(tokens[j]) as RegExpMatchArray;
            if (match) break;
          }
    
          // @ts-ignore
          return match[1];
        });
    
        const ratio = Number(procent) / 100;
    
        if (ratio > 0) {
    
          try {
    
            await msg.react(emojiID);
    
            const { error } = BullyingManager.addReaction(userID, ratio, emojiID);
    
            if (error) {
              msg.react('❌');
              msg.channel.send(error).then(m => {
                setTimeout(() => m.delete(), 3000);
              }).catch();
            } else {
              // Everything done right, yay!
            }
    
          } catch (err) {
            // For now we just assume the error is because it can't use the emoji #TODO
            msg.channel.send(`Aw <@!${msg.author.id}>, that's either an invalid emoji or I can't use it. (I can only use emojis from servers I'm in)`).catch();
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
        break;
      }
    }
  }

};


export default command;
