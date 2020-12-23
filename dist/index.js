"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const client = new discord_js_1.default.Client();
dotenv_1.default.config();
client.on('message', msg => {
    if (msg.author.id === "219091519590629376") {
        msg.react('🐸');
        msg.react('🚿');
    }
});
client.login(env('TOKEN'));
function env(name) {
    const value = process.env[name];
    if (value) {
        return value;
    }
    throw new TypeError(`Missing process.env.${name}`);
}
//# sourceMappingURL=index.js.map