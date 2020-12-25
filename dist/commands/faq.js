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
const discord_js_1 = require("discord.js");
exports.default = {
    name: 'faq',
    permissions: [],
    execute({ msg, cmd }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield msg.delete();
                yield msg.channel.send(new discord_js_1.MessageEmbed()
                    .setColor('#161219')
                    .setTitle('Frequently Asked Questions')
                    .setDescription('https://community.supermechs.com/knowledgebase/faq/')
                    .setFooter(`+${cmd.name} requested by ${msg.author.tag}`));
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
};
