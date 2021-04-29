"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = env;
