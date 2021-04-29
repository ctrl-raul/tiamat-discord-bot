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
let lastMsg = null;
const cooldown = 120000;
function disableBaseTip(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!msg.content.includes('disable') || !msg.content.includes('base')) {
            return false;
        }
        try {
            if ((lastMsg && Date.now() - lastMsg.createdTimestamp > cooldown) || !lastMsg) {
                const reply = yield msg.reply('To disable your base contact Marija.');
                lastMsg = reply;
            }
            else {
                msg.react('🛑');
                lastMsg.react('<:this:790244810186948698>');
            }
        }
        catch (err) {
            console.log(err);
        }
        return true;
    });
}
exports.default = disableBaseTip;
