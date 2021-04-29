"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReactToText {
    constructor(client) {
        this.tests = [];
        client.on('message', msg => {
            for (const [test, reaction] of this.tests) {
                if (typeof test === 'string') {
                    if (msg.content.includes(test)) {
                        msg.react(reaction).catch();
                    }
                }
                else {
                    if (test.test(msg.content)) {
                        msg.react(reaction).catch();
                    }
                }
            }
        });
    }
    add(test, reaction) {
        this.tests.push([test, reaction]);
    }
}
exports.default = ReactToText;
