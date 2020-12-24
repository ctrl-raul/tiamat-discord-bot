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
dotenv_1.default.config();
const client = new discord_js_1.default.Client();
const targets = env('TARGET_USER_IDS').split(' ');
const app = express_1.default();
const matchFrog = /f+r+[o0]+g+|g+r+[e3]+n+[o0]+u+[i1]+l+[e3]+/i;
client.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const frogIt = targets.includes(msg.author.id) || matchFrog.test(msg.content);
    if (frogIt) {
        try {
            yield msg.react('🐸');
            yield msg.react('🚿');
        }
        catch (err) {
        }
    }
}));
client.login(env('TOKEN'));
app.listen(env('PORT', '3000'));
app.get('/', (_, res) => {
    res.send('Where are you going?');
});
function env(name, defaultValue) {
    const value = process.env[name];
    if (value) {
        return value;
    }
    if (typeof defaultValue === 'string') {
        return defaultValue;
    }
    throw new TypeError(`Missing process.env.${name}`);
}
//# sourceMappingURL=index.js.map