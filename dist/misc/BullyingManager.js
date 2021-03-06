"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const BullyingManager = new (class {
    constructor() {
        this.DBFilePath = path_1.default.resolve(__dirname, './reactions-db.json');
        this.operable = false;
        this.cache = {};
        this.init();
    }
    init() {
        try {
            if (this.isMissingDBFile()) {
                console.log('missing db file');
                this.createDBFile();
                console.log('db file created');
                this.operable = true;
                console.log('operable');
            }
            else {
                console.log('db file exists');
                this.operable = true;
                this.cache = this.getFreshData();
            }
        }
        catch (err) {
            console.log(`Failed to init, reactions DB:`, err);
        }
    }
    isMissingDBFile() {
        return !fs_1.default.existsSync(this.DBFilePath);
    }
    createDBFile() {
        fs_1.default.writeFileSync(this.DBFilePath, '{}');
    }
    getFreshData() {
        const rawData = fs_1.default.readFileSync(this.DBFilePath);
        return JSON.parse(rawData.toString());
    }
    evaluate(msg) {
        let valid = false;
        if (this.operable) {
            const entries = Object.entries(this.cache);
            for (const [userID, data] of entries) {
                if (msg.author.id === userID) {
                    valid = true;
                    for (const { chance, emojiID } of data) {
                        if (Math.random() < chance) {
                            msg.react(emojiID).catch(err => {
                                console.log(err.name);
                                console.log(emojiID);
                            });
                        }
                    }
                }
            }
        }
        return valid;
    }
    addReaction(key, chance, emojiID) {
        if (this.operable) {
            try {
                const data = this.getFreshData();
                const entry = { chance, emojiID };
                if (Array.isArray(data[key])) {
                    const existingReaction = data[key].find(e => e.emojiID === emojiID);
                    if (existingReaction) {
                        existingReaction.chance = chance;
                    }
                    else {
                        data[key].push(entry);
                    }
                }
                else {
                    data[key] = [entry];
                }
                this.cache = data;
                fs_1.default.writeFileSync(this.DBFilePath, JSON.stringify(data, null, 2));
                return { error: null };
            }
            catch (err) {
                console.warn(err);
                return { error: 'Failed to add reaction: ' + err.name };
            }
        }
        return { error: 'Reactions system not operating, try again later.' };
    }
    remReaction(userID, emojiID) {
        if (this.operable) {
            try {
                const data = this.getFreshData();
                if (Array.isArray(data[userID])) {
                    const index = data[userID].findIndex(j => j.emojiID === emojiID);
                    if (index >= 0) {
                        data[userID].splice(index, 1);
                        if (data[userID].length === 0) {
                            delete data[userID];
                        }
                    }
                    else {
                        return { error: `This reaction isn't being used.` };
                    }
                }
                else {
                    return { error: `There are no reactions for this user.` };
                }
                this.cache = data;
                fs_1.default.writeFileSync(this.DBFilePath, JSON.stringify(data, null, 2));
            }
            catch (err) {
                return { error: `Failed to add bullying reaction.` };
            }
        }
        return { error: null };
    }
    remUser(userID) {
        if (this.operable) {
            try {
                const data = this.getFreshData();
                if (userID in data) {
                    delete data[userID];
                }
                else {
                    return { error: `User '${userID}' not in database` };
                }
                this.cache = data;
                fs_1.default.writeFileSync(this.DBFilePath, JSON.stringify(data, null, 2));
            }
            catch (err) {
                return { error: `Failed to stop bullying '${userID}'` };
            }
        }
        return { error: null };
    }
    getData() {
        return JSON.parse(JSON.stringify(this.cache));
    }
    setData(json) {
        try {
            console.log(json);
            this.cache = JSON.parse(json);
        }
        catch (err) {
            return { error: `Invalid data` };
        }
        try {
            fs_1.default.writeFileSync(this.DBFilePath, JSON.stringify(this.cache, null, 2));
        }
        catch (err) {
            return { error: `I committed a mistake, please try again` };
        }
        return null;
    }
})();
exports.default = BullyingManager;
