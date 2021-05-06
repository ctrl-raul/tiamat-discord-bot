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
const path_1 = __importDefault(require("path"));
const BullyingManager_1 = __importDefault(require("./misc/BullyingManager"));
const CommandsManager_1 = __importDefault(require("./CommandsManager"));
const ReactToText_1 = __importDefault(require("./misc/ReactToText"));
const env_1 = __importDefault(require("./utils/env"));
dotenv_1.default.config();
const LOCALLY = env_1.default('LOCALLY', 'false') === 'true';
const PREFIX_PROD = '+';
const PREFIX = LOCALLY ? '-' : PREFIX_PROD;
const client = new discord_js_1.default.Client();
const reactToText = new ReactToText_1.default(client);
const commandsManager = new CommandsManager_1.default({
    prefix: PREFIX,
    commandsDir: path_1.default.join(__dirname, './commands'),
    onExecutingCommand: cmd => console.log(`Executing command '${cmd.name}'`),
    onCommandExecutionError: (cmd, err) => console.error(`Failed to execute command '${cmd.name}':`, err),
});
reactToText.add(/f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i, '<:frog1:790563843088711700>');
reactToText.add(/k+i+l+i+n+(?!g)/i, '<:hacker:793643471084847144>');
client.on('ready', () => {
    if (!client.user)
        return;
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: 'prefix: ' + PREFIX_PROD
        }
    }).catch();
    client.user.setUsername('Tiamat').catch();
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (msg.author.bot)
        return;
    if (msg.channel.type === 'dm' && msg.author.id !== ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id)) {
        msg.channel.send(`I don't like DMs.`).catch();
        return;
    }
    BullyingManager_1.default.evaluate(msg);
    const fail = commandsManager.evaluate(msg);
    if (fail !== null) {
        switch (fail.name) {
            case 'COMMAND_DISABLED':
            case 'MISSING_PERMISSIONS':
                msg.react('❌').catch();
                break;
            case 'PRIVATE_MESSAGE':
                msg.channel.send(`I don't like PMs`).catch();
                break;
        }
    }
}));
client.login(env_1.default('TOKEN'));
{
    const commandNames = Object.keys(commandsManager.commands);
    console.log(`Running in ${LOCALLY ? 'dev' : 'prod'}. (prefix: ${PREFIX})`);
    console.log(`Successfuly loaded ${commandNames.length} commands:`);
    console.log(commandNames);
}
