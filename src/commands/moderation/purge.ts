import Discord from 'discord.js';
import { CommandModule } from '../../CommandsManager';

// TODO: Delete messages from specific users

// const matchUintAtStart = /^\d+(?=(\s|$))/;
const matchMsgID = /\d{18}$/;

const command: CommandModule = {

  permissions: ['MANAGE_MESSAGES'],

  async execute ({ msg, args, onError }) {

    if (msg.channel.type === 'dm') {
      onError(new Error('Cannot purge direct messages'));
      return;
    }

    const match = args.match(matchMsgID);

    if (match !== null) {

      const argumentMsgID = match[0];
      const msgsToDelete: Discord.Message[] = [];
      const msgsPerBatch = 100; // Max 100


      // Get the messages that shall be deleted
      try {

        let mostRecent = await msg.channel.messages.fetch(argumentMsgID);

        do {

          const latest100Msgs = await msg.channel.messages.fetch({
            after: mostRecent.id,
            limit: 100
          });

          const first = latest100Msgs.first();

          if (!first) {
            onError(new Error('No most recent message'));
            return;
          }

          msgsToDelete.push(...latest100Msgs.values());
          mostRecent = first;

        } while (mostRecent.createdTimestamp < msg.createdTimestamp);

      } catch (err) {
        onError(err);
        return;
      }


      // Make batches of {msgsPerBatch} messages and bulk delete
      
      let msgsTooOldCounter = 0;
      let deleteAttemptsFailed = 0;

      for (let page = 0; page < msgsToDelete.length / msgsPerBatch; page ++) {

        const msgsToDeleteCollection = new Discord.Collection<string, Discord.Message>();
        const currentPageMsgs = msgsToDelete.slice(page * msgsPerBatch, page * msgsPerBatch + msgsPerBatch);

        for (const msg_b of currentPageMsgs) {
          // Can definitely improve this...
          if (passedTwoWeeks(msg_b.createdTimestamp)) {
            msgsTooOldCounter++;
          } else if (!msg_b.pinned) {
            msgsToDeleteCollection.set(msg_b.id, msg_b);
          }
        }

        try {
          await msg.channel.bulkDelete(msgsToDeleteCollection);
        } catch (err) {
          deleteAttemptsFailed += msgsPerBatch;
        }

      }

      if (msgsTooOldCounter) {
        msg.channel.send(`Could not delete ${msgsTooOldCounter} messages because they are older than two weeks.`);
      }

      if (deleteAttemptsFailed) {
        msg.channel.send(`Failed to delete ${deleteAttemptsFailed} messages, please try again.`);
      }

    }

    // let limit = 2;

    // if (args.length) {
    //   const match = args.match(matchUintAtStart);
    //   if (match) {
    //     limit = 1 + Math.min(99, Number(match[0]) || 1);
    //   } else {
    //     msg.react('❌').catch();
    //     return;
    //   }
    // }

    // try {
    //   const msgsToDelete = await msg.channel.messages.fetch({ limit });
    //   await msg.channel.bulkDelete(msgsToDelete);
    // } catch(err) {
    //   onError(err);
    // }
  }

};


// https://github.com/discord/discord-api-docs/issues/208
function passedTwoWeeks (timestamp: number) {
  return timestamp <= Date.now() - 14 * 24 * 60 * 60 * 1000;
}


export default command;
