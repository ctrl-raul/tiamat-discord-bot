"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsesHistory {
    constructor(entryLifetimeSeconds) {
        this.history = {};
        this.entryLifetimeSeconds = entryLifetimeSeconds;
    }
    add(key, timestamp) {
        if (this.history[key]) {
            this.history[key].push(timestamp);
        }
        else {
            this.history[key] = [timestamp];
        }
    }
    getCount(key) {
        const history = this.history[key];
        if (typeof history === 'undefined')
            return 0;
        const now = Date.now();
        const cleanedHistory = history.filter(time => now - time < this.entryLifetimeSeconds * 1000);
        this.history[key] = cleanedHistory;
        return cleanedHistory.length;
    }
}
exports.default = UsesHistory;
