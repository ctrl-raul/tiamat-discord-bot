"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embedLink_1 = __importDefault(require("../../utils/embedLink"));
const command = {
    enabled: false,
    execute(args) {
        const { msg, onError } = args;
        const embed = embedLink_1.default('Guidelines', 'https://community.supermechs.com/guidelines/', '#161219', args);
        msg.channel.send(embed).catch(onError);
        msg.delete().catch();
    }
};
exports.default = command;
