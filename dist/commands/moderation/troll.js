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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BullyingManager_1 = __importDefault(require("../../BullyingManager"));
const matchSyntax = /<@!(\d+)>\s+(.+)\s+(\d+)/;
const command = {
    permissions: ['MANAGE_MESSAGES'],
    execute({ msg, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(args);
            const match = args.match(matchSyntax);
            if (!match) {
                msg.react('❌');
                return;
            }
            ;
            const [_, userID, emojiID, procent] = match;
            const ratio = Number(procent) / 100;
            if (ratio > 0) {
                try {
                    yield msg.react(emojiID);
                    const { error } = BullyingManager_1.default.addReaction(userID, ratio, emojiID);
                    if (error) {
                        msg.react('❌');
                        msg.author.send(error).catch();
                    }
                    else {
                    }
                }
                catch (err) {
                    msg.channel.send(`Aw <@!${msg.author.id}>, I can only use emojis from servers I'm in.`).then(m => {
                        setTimeout(() => m.delete(), 3000);
                    }).catch();
                }
            }
            else {
                const { error } = BullyingManager_1.default.remReaction(userID, emojiID);
                if (!error) {
                    msg.react('✔️');
                }
                else {
                    msg.channel.send(error).then(m => {
                        setTimeout(() => m.delete(), 3000);
                    }).catch();
                }
            }
        });
    }
};
exports.default = command;
