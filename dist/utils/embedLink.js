"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function embedLink(title, link, color, args) {
    const lines = [
        link,
        '\u200b',
        `\`${args.prefix + args.cmd.name}\` requested by <@${args.msg.author.id}>`,
    ];
    return new discord_js_1.MessageEmbed()
        .setColor(color)
        .addField(title, lines.join('\n'));
}
exports.default = embedLink;
;
