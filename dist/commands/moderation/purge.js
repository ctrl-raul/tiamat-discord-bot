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
const matchMsgID = /\d{18}$/;
const command = {
    permissions: ['MANAGE_MESSAGES'],
    execute({ msg, args, onError }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msg.channel.type === 'dm') {
                onError(new Error('Cannot purge direct messages'));
                return;
            }
            const match = args.match(matchMsgID);
            if (match !== null) {
                const argumentMsgID = match[0];
                const msgsToDelete = [];
                const msgsPerBatch = 100;
                try {
                    let mostRecent = yield msg.channel.messages.fetch(argumentMsgID);
                    do {
                        const latest100Msgs = yield msg.channel.messages.fetch({
                            after: mostRecent.id,
                            limit: 100
                        });
                        const first = latest100Msgs.first();
                        if (!first) {
                            onError(new Error('No most recent message'));
                            return;
                        }
                        msgsToDelete.push(...latest100Msgs.values());
                        mostRecent = first;
                    } while (mostRecent.createdTimestamp < msg.createdTimestamp);
                }
                catch (err) {
                    onError(err);
                    return;
                }
                let msgsTooOldCounter = 0;
                let deleteAttemptsFailed = 0;
                for (let page = 0; page < msgsToDelete.length / msgsPerBatch; page++) {
                    const msgsToDeleteCollection = new discord_js_1.default.Collection();
                    const currentPageMsgs = msgsToDelete.slice(page * msgsPerBatch, page * msgsPerBatch + msgsPerBatch);
                    for (const msg_b of currentPageMsgs) {
                        if (passedTwoWeeks(msg_b.createdTimestamp)) {
                            msgsTooOldCounter++;
                        }
                        else if (!msg_b.pinned) {
                            msgsToDeleteCollection.set(msg_b.id, msg_b);
                        }
                    }
                    try {
                        yield msg.channel.bulkDelete(msgsToDeleteCollection);
                    }
                    catch (err) {
                        deleteAttemptsFailed += msgsPerBatch;
                    }
                }
                if (msgsTooOldCounter) {
                    msg.channel.send(`Could not delete ${msgsTooOldCounter} messages because they are older than two weeks.`);
                }
                if (deleteAttemptsFailed) {
                    msg.channel.send(`Failed to delete ${deleteAttemptsFailed} messages, please try again.`);
                }
            }
        });
    }
};
function passedTwoWeeks(timestamp) {
    return timestamp <= Date.now() - 14 * 24 * 60 * 60 * 1000;
}
exports.default = command;
