import { CommandModule } from '../../CommandsManager';
import nodeFetch from 'node-fetch';
import Discord from 'discord.js';
import statTemplates, { StatKey } from '../../data/stat-templates';
import UsesHistory from '../../utils/UsesHistory';


interface WUItem {
  name: string;
  element: 'PHYSICAL' | 'EXPLOSIVE' | 'ELECTRIC';
  image: string;
  stats: { [K in StatKey]: number | [number, number] };
}

interface WUItemsPack {
  config: {
    name: string;
    description: string;
    key: string;
    base_url: string;
  };
  items: WUItem[];
}


const itemsPackURL = 'https://gist.githubusercontent.com/ctrl-raul/3b5669e4246bc2d7dc669d484db89062/raw/';
let itemsPack: WUItemsPack | null = null;
let loadingItemsPack = true;


const colors = {
  PHYSICAL: '#ffaa00',
  EXPLOSIVE: '#aa1111',
  ELECTRIC: '#00aaff',
};

const history = new UsesHistory(60);
const maxUsesForTime = 1;


getJSON<WUItemsPack>(itemsPackURL)
  .then(json => {
    itemsPack = json;
  })
  .finally(() => {
    loadingItemsPack = false;
  });


const command: CommandModule = {

  // permissions: 'MANAGE_MESSAGES',

  execute ({ args, msg, prefix, cmd, onError }) {

    if (!(['802231408785489961', '789536414916018206'].includes(msg.channel.id))) {
      msg.react('❌').catch();
      return;
    }

    const itemRequestsCount = history.getCount(msg.author.id);

    console.log({ itemRequestsCount, maxUsesForTime })

    if (itemRequestsCount > maxUsesForTime) {
      msg.reply(
        `You have already requested items ${itemRequestsCount} times in the last ${history.entryLifetimeSeconds} seconds, please consider using https://workshop-unlimited.vercel.app/ instead. \n(Tip: You can use +wu to get that link)`
      );
      return;
    }

    if (!itemsPack) {
      if (loadingItemsPack) {
        msg.channel.send(`We're still loading the Items Pack, please try again in 5 seconds.`).catch(onError);
      } else {
        msg.channel.send(`Failed to load items pack, items unavailable.`).catch(onError);
      }
      return;
    }

    const name = args.trim().toLowerCase().replace(/\s+/g, '');

    for (const item of itemsPack.items) {
      if (item.name.toLowerCase().replace(/\s+/g, '') === name) {

        const embedLines: string[] = [];

        for (const [key, value] of Object.entries(item.stats)) {
          const template = statTemplates[key] as typeof statTemplates[StatKey];
          const valueStr = Array.isArray(value) ? value.join('-') : String(value);
          embedLines.push(`${template.name}: **${valueStr}**`);
        }

        embedLines.push(
          '\u200b',
          `\`${prefix + cmd.name} ${item.name}\` requested by <@${msg.author.id}>`
        );

        const embed = new Discord.MessageEmbed();
        embed.setColor(colors[item.element])
        embed.addField(item.name, embedLines.join('\n'));
        embed.setThumbnail(item.image.replace('%url%', itemsPack.config.base_url));

        msg.channel.send(embed)
          .then(() => history.add(msg.author.id, Date.now()))
          .catch(onError);

        msg.delete().catch(onError);

        return;
      }
    }

    msg.channel.send('Couldn\'t find that item.').catch();

  }

};


// utils

async function getJSON <T> (url: string): Promise<T> {
  const response = await nodeFetch(url);
  return await response.json();
}


// Exports

export default command;
