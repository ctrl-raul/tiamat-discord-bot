import { MessageEmbed } from 'discord.js';
import { CommandExecuteArguments } from '../libs/DiscordCommandsManager';

export default function embedLink (title: string, link: string, color: string, args: CommandExecuteArguments): MessageEmbed {

  const lines = [
    link,
    '\u200b',
    `\`${args.prefix + args.cmd.name}\` requested by <@${args.msg.author.id}>`,
  ];

  return new MessageEmbed()
    .setColor(color)
    .addField(title, lines.join('\n'));

};
