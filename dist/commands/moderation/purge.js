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
const command = {
    permissions: ['MANAGE_MESSAGES'],
    execute({ msg, args, onError }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msg.channel.type === 'dm') {
                msg.channel.send('Can not purge in DMs.');
                return;
            }
            const limit = 1 + Math.max(1, Math.min(100, Number(args.match(/^\d+/)) || 1));
            try {
                yield msg.channel.bulkDelete(yield msg.channel.messages.fetch({ limit }));
            }
            catch (err) {
                onError(err);
            }
        });
    }
};
exports.default = command;
