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
const discord_js_1 = __importDefault(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const DiscordCommandsManager_1 = __importDefault(require("./libs/DiscordCommandsManager"));
const env_1 = __importDefault(require("./utils/env"));
dotenv_1.default.config();
const PREFIX_PROD = '+';
const PREFIX_DEV = '-';
const PREFIX = env_1.default('LOCALLY', 'false') === 'true' ? PREFIX_DEV : PREFIX_PROD;
const matchFrog = /f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i;
const client = new discord_js_1.default.Client();
const app = express_1.default();
const CMDM = DiscordCommandsManager_1.default(PREFIX, path_1.default.join(__dirname, './commands'), true);
const froggerID = '219091519590629376';
const matchKillin = /i+ll+i+n+(?!g)/i || /k+i+l+i+n+/i;
init();
function onReady() {
    if (!client.user) {
        return;
    }
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'prefix: ' + PREFIX_PROD
        }
    });
    client.user.setUsername('Tiamat');
    console.log(`Logged in as ${client.user.tag}!`);
}
function onMessage(msg) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (msg.author.bot) {
            return;
        }
        if (msg.channel.type === 'dm' && msg.author.id !== ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id)) {
            msg.channel.send(`I don't like DMs.`);
            return;
        }
        if ((msg.author.id === froggerID && Math.random() > 0.925)
            || (matchFrog.test(msg.content))) {
            try {
                yield msg.react('<:frog1:790563843088711700>');
                yield msg.react('🚿');
            }
            catch (err) {
                console.error('Failed to react with frog:', err);
            }
        }
        if (matchKillin.test(msg.content)) {
            try {
                yield msg.react('<:hacker:793643471084847144>');
            }
            catch (err) {
                console.error('Failed to react with hacker:', err);
            }
        }
        if (yield CMDM.evaluate(msg)) {
            return;
        }
    });
}
function init() {
    const PORT = env_1.default('PORT', '3000');
    const commandNames = Object.keys(CMDM.cmds);
    client.on('ready', onReady);
    client.on('message', onMessage);
    client.login(env_1.default('TOKEN'));
    app.listen(PORT, () => console.log('Listening on port', PORT));
    app.get('/', (_, res) => res.send('Where are you going?'));
    console.log('Successfuly loaded', commandNames.length, 'command(s)!');
    console.log(commandNames);
}
