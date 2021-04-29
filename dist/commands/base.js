"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command = {
    permissions: ['MANAGE_MESSAGES'],
    execute({ msg, onError }) {
        msg.channel.send('Send a private message to <@336988655748907008> to remove your base.')
            .catch(onError);
    }
};
exports.default = command;
