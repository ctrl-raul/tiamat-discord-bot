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
exports.hasPermissions = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function loadCommands(path, cmds = {}) {
    var _a;
    const contents = fs_1.default.readdirSync(path_1.default.resolve(path));
    const subdirs = [];
    const files = [];
    for (const x of contents) {
        if (fs_1.default.lstatSync(path_1.default.join(path, x)).isDirectory()) {
            subdirs.push(x);
        }
        else {
            files.push(x);
        }
    }
    for (const fileName of files) {
        const filePath = path_1.default.join(path, fileName);
        const required = require(filePath);
        const cmdModule = required.default;
        (_a = cmdModule.name) !== null && _a !== void 0 ? _a : (cmdModule.name = fileName.replace(/\.\w+$/i, ''));
        if (cmds.hasOwnProperty(cmdModule.name)) {
            const messageLines = [
                `found two commands with the name '${cmdModule.name}'`,
                '  command paths:',
                '  ' + cmds[cmdModule.name].path,
                '  ' + filePath,
                ''
            ];
            throw new Error(messageLines.join('\n'));
        }
        else if (cmdModule.name in cmds) {
            const messageLines = [
                `'${cmdModule.name}' cannot be used as a command name because it overrides a built-in Object property`,
                '  command path:',
                '  ' + filePath,
                ''
            ];
            throw new Error(messageLines.join('\n'));
        }
        const permissions = (!cmdModule.permissions
            ? []
            : (typeof cmdModule.permissions === 'string'
                ? [cmdModule.permissions]
                : cmdModule.permissions));
        cmds[cmdModule.name] = {
            name: cmdModule.name,
            execute: cmdModule.execute,
            disabled: cmdModule.disabled || false,
            path: filePath,
            permissions,
        };
    }
    for (const dir of subdirs) {
        loadCommands(path_1.default.join(path, dir), cmds);
    }
    return cmds;
}
function hasPermissions(permissions, required) {
    for (let x of required) {
        if (permissions.has(x)) {
            return true;
        }
    }
    return false;
}
exports.hasPermissions = hasPermissions;
function default_1(prefix, path, logs = false) {
    const regexSafePrefix = prefix.replace(/([^\w])/g, '\\$1');
    const cmdCall = new RegExp(`^${regexSafePrefix}([^\\s])+(?=\\s|)`, 'i');
    const badSpaces = /^\s+|\s+$|\s+(?=\s)/g;
    const cmds = loadCommands(path);
    const errorLogger = (err, cmd) => {
        console.error(`Failed to execute command '${cmd.name}':`, err);
    };
    return {
        cmds,
        evaluate(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                const match = msg.content.match(cmdCall);
                if (!match) {
                    return false;
                }
                const cmdName = match[0].substring(prefix.length);
                const cmd = cmds[cmdName];
                if (typeof cmd !== 'undefined') {
                    if (msg.member) {
                        const args = msg.content
                            .substring(prefix.length + cmd.name.length)
                            .replace(badSpaces, '');
                        if (!cmd.permissions.length || hasPermissions(msg.member.permissions, cmd.permissions)) {
                            if (logs) {
                                console.log('Executing command', cmd.name);
                            }
                            cmd.execute({
                                msg,
                                args,
                                cmd,
                                prefix,
                                onError: (err) => errorLogger(err, cmd)
                            });
                        }
                        else {
                            msg.react('❌');
                        }
                    }
                }
                return false;
            });
        }
    };
}
exports.default = default_1;
