import Discord from "discord.js";

let lastMsg: Discord.Message | null = null;
const cooldown = 120000;


export default async function disableBaseTip (msg: Discord.Message): Promise<boolean> {

  if (!msg.content.includes('disable') || !msg.content.includes('base')) {
    return false;
  }

  try {
    if ((lastMsg && Date.now() - lastMsg.createdTimestamp > cooldown) || !lastMsg) {
      const reply = await msg.reply('To disable your base contact Marija.');
      lastMsg = reply;
    } else {
      msg.react('🛑');
      lastMsg.react('<:this:790244810186948698>');
    }
  } catch (err) {
    console.log(err);
  }

  return true;
}
