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
const node_fetch_1 = __importDefault(require("node-fetch"));
const discord_js_1 = require("discord.js");
const stat_templates_1 = __importDefault(require("../../data/stat-templates"));
const itemsPackURL = 'https://gist.githubusercontent.com/ctrl-raul/3b5669e4246bc2d7dc669d484db89062/raw/';
let itemsPack = null;
let loadingItemsPack = true;
const colors = {
    PHYSICAL: '#ffaa00',
    EXPLOSIVE: '#aa1111',
    ELECTRIC: '#00aaff',
};
getJSON(itemsPackURL)
    .then(json => {
    itemsPack = json;
})
    .finally(() => {
    loadingItemsPack = false;
});
const command = {
    permissions: 'MANAGE_MESSAGES',
    execute({ args, msg, onError }) {
        if (!itemsPack) {
            if (loadingItemsPack) {
                msg.channel.send(`We're still loading the Items Pack, please try again in 5 seconds.`).catch(onError);
            }
            else {
                msg.channel.send(`Failed to load items pack, items unavailable.`).catch(onError);
            }
            return;
        }
        const name = args.trim().toLowerCase().replace(/\s+/g, '');
        for (const item of itemsPack.items) {
            if (item.name.toLowerCase().replace(/\s+/g, '') === name) {
                const statLines = [];
                for (const [key, value] of Object.entries(item.stats)) {
                    const template = stat_templates_1.default[key];
                    const valueStr = typeof value === 'number' ? value.toString() : value.join('-');
                    statLines.push(`${template.name}: **${valueStr}**`);
                }
                const embed = new discord_js_1.MessageEmbed();
                embed.setColor(colors[item.element]);
                embed.addField(item.name, statLines.join('\n'));
                msg.channel.send(embed).catch(onError);
                return;
            }
        }
        msg.channel.send('Couldn\'t find that item.').catch();
    }
};
function getJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(url);
        return yield response.json();
    });
}
exports.default = command;
