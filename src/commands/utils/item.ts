import { CommandModule } from '../../CommandsManager';
import nodeFetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import statTemplates, { StatKey } from '../../data/stat-templates';


interface WUItem {
  name: string;
  element: 'PHYSICAL' | 'EXPLOSIVE' | 'ELECTRIC';
  stats: { [K in StatKey]: number | [number, number] };
}

interface WUItemsPack {
  config: {
    name: string;
    description: string;
    key: string;
    baseURL: string;
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


getJSON<WUItemsPack>(itemsPackURL)
  .then(json => {
    itemsPack = json;
  })
  .finally(() => {
    loadingItemsPack = false;
  })


const command: CommandModule = {

  permissions: 'MANAGE_MESSAGES',

  execute ({ args, msg, onError }) {

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

        const statLines: string[] = [];

        for (const [key, value] of Object.entries(item.stats)) {
          const template = statTemplates[key] as typeof statTemplates[StatKey];
          const valueStr = typeof value === 'number' ? value.toString() : value.join('-');
          statLines.push(`${template.name}: **${valueStr}**`);
        }

        const embed = new MessageEmbed();
        embed.setColor(colors[item.element])
        embed.addField(item.name, statLines.join('\n'));
        // embed.setImage(itemsPack.config.baseURL + item.name.replace(/\s+/g, '') + '.png');

        msg.channel.send(embed).catch(onError);

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
