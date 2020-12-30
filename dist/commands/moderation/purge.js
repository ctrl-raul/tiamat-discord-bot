"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const matchUintAtStart = /^\d+(?=(\s|$))/;
const command = {
    permissions: ['MANAGE_MESSAGES'],
    execute({ msg, args, onError }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msg.channel.type === 'dm') {
                msg.channel.send('Can not purge in DMs.').catch();
                return;
            }
            let limit = 2;
            if (args.length) {
                const match = args.match(matchUintAtStart);
                if (match) {
                    limit = 1 + Math.min(99, Number(match[0]) || 1);
                }
                else {
                    msg.react('❌').catch();
                    return;
                }
            }
            msg.channel.messages.fetch({ limit })
                .then(msg.channel.bulkDelete)
                .catch(onError);
        });
    }
};
exports.default = command;
