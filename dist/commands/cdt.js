"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const history = {};
const timeInSeconds = 10;
const maxUsesForTime = 2;
function addToHistory(msg) {
    if (history[msg.author.id]) {
        history[msg.author.id].push(msg.createdTimestamp);
    }
    else {
        history[msg.author.id] = [msg.createdTimestamp];
    }
}
function howManyInLastMinute(msg) {
    const userHistory = history[msg.author.id];
    if (typeof userHistory === 'undefined') {
        return 0;
    }
    const times = userHistory.filter(time => {
        const timePassed = msg.createdTimestamp - time;
        console.log(timePassed);
        return timePassed < timeInSeconds * 1000;
    });
    if (times.length === 0) {
        delete history[msg.author.id];
    }
    else {
        history[msg.author.id] = times;
    }
    return times.length;
}
const command = {
    execute({ msg }) {
        addToHistory(msg);
        msg.channel.send('```json\n' + JSON.stringify({
            timesInCount: howManyInLastMinute(msg),
            maxUsesForTime,
            timeCounted: timeInSeconds,
            reachedLimitForTime: howManyInLastMinute(msg) > maxUsesForTime
        }, null, 2) + '\n```');
    }
};
exports.default = command;
