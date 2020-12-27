"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command = {
    permissions: ['MANAGE_MESSAGES'],
    execute({ msg, onError }) {
        msg.channel.send('If you keep behaving like that, you can PM <@336988655748907008> to remove your balls.')
            .catch(onError);
    }
};
exports.default = command;
