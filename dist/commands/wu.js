"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    disabled: true,
    execute({ msg, cmd, prefix, onError }) {
        const replyLines = [
            'https://workshop-unlimited.vercel.app/',
            '\u200b',
            prefix + cmd.name + ' requested by <@' + msg.author.id + '>'
        ];
        const embed = new discord_js_1.MessageEmbed()
            .setColor('#06222a')
            .addField('Workshop Unlimited', replyLines.join('\n'));
        msg.channel.send(embed).catch(onError);
        msg.delete().catch();
    }
};
exports.default = command;
