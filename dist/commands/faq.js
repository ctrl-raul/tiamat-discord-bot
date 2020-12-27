"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    execute({ msg, cmd, onError, prefix }) {
        const replyLines = [
            'https://community.supermechs.com/knowledgebase/faq/',
            '\u200b',
            prefix + cmd.name + ' requested by <@' + msg.author.id + '>'
        ];
        const embed = new discord_js_1.MessageEmbed()
            .setColor('#161219')
            .addField('Frequently Asked Questions', replyLines.join('\n'));
        msg.channel.send(embed).catch(onError);
        msg.delete().catch();
    }
};
exports.default = command;
