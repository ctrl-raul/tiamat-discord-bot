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
const regex_userMention = /<@!(\d{18})>/;
const regex_userID = /(\d{18})/;
const regex_emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|<a{0,1}:.+?:\d{18}>)/;
const syntax = [
    [regex_userMention, regex_userID],
    [regex_emoji],
    [/(\d+)/],
];
const command = {
    permissions: ['MANAGE_MESSAGES'],
    execute({ msg, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(args);
            const words = args.split(' ');
            if (words[0] === 'clear') {
                const { error } = BullyingManager_1.default.remUser(words[1]);
                if (!error) {
                    msg.react('✔️');
                }
                else {
                    msg.channel.send(error).then(m => {
                        setTimeout(() => m.delete(), 3000);
                    }).catch();
                }
                return;
            }
            if (words[0] === 'data') {
                const lines = [
                    '```json',
                    JSON.stringify(BullyingManager_1.default.getData(), null, 2),
                    '```',
                ];
                msg.channel.send(lines.join('\n'));
                return;
            }
            const validSyntax = syntax.every((tokens, i) => {
                return tokens.some(token => token.test(words[i]));
            });
            if (!validSyntax) {
                msg.react('❌');
                msg.channel.send('Invalid syntax');
                return;
            }
            ;
            const [userID, emojiID, procent] = syntax.map((tokens, i) => {
                let match;
                for (let j = 0; j < tokens.length; j++) {
                    match = words[i].match(tokens[j]);
                    if (match)
                        break;
                }
                return match[1];
            });
            const ratio = Number(procent) / 100;
            if (ratio > 0) {
                try {
                    yield msg.react(emojiID);
                    const { error } = BullyingManager_1.default.addReaction(userID, ratio, emojiID);
                    if (error) {
                        msg.react('❌');
                        msg.channel.send(error).then(m => {
                            setTimeout(() => m.delete(), 3000);
                        }).catch();
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
