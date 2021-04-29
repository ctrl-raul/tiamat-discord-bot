"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command = {
    name: '?',
    execute({ msg, args, onError }) {
        if (args.length) {
            const reply = '```json\n' + JSON.stringify({ args }, null, 2) + '\n```';
            msg.channel.send(reply).catch(onError);
        }
        else {
            msg.react('❗').catch(onError);
        }
    }
};
exports.default = command;
