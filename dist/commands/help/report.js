"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embedLink_1 = __importDefault(require("../../utils/embedLink"));
const command = {
    execute(args) {
        const { msg, onError } = args;
        const embed = embedLink_1.default('Report a potential Cheater', 'https://docs.google.com/forms/d/e/1FAIpQLSdpTi7ARgV-5ncdfXi2QzEOUXGlSM-1XN6IrMqyjknFyk0yxA/viewform', '#aaaaaa', args);
        msg.channel.send(embed).catch(onError);
        msg.delete().catch();
    }
};
exports.default = command;
