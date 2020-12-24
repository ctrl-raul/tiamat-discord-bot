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
    const contents = fs_1.default.readdirSync(path_1.default.resolve(path));
    const subdirs = [];
    const files = [];
    for (const dir of contents) {
        const filePath = path_1.default.join(path, dir);
        if (fs_1.default.lstatSync(filePath).isDirectory()) {
            subdirs.push(filePath);
        }
        else {
            files.push(filePath);
        }
    }
    for (const filePath of files) {
        const cmdModule = require(filePath).default;
        if (cmds.hasOwnProperty(cmdModule.name)) {
            const message = [
                `found two commands with the name '${cmdModule.name}'`,
                '  command paths:',
                '  ' + cmds[cmdModule.name].path,
                '  ' + filePath,
                ''
            ].join('\n');
            throw new Error(message);
        }
        else if (cmdModule.name in cmds) {
            const message = [
                `'${cmdModule.name}' cannot be used as a command name because it overrides a built-in Object property`,
                '  command path:',
                '  ' + filePath,
                ''
            ].join('\n');
            throw new Error(message);
        }
        cmds[cmdModule.name] = Object.assign({ path: filePath }, cmdModule);
    }
    for (const dir of subdirs) {
        console.log(dir);
        loadCommands(dir, cmds);
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
function default_1(prefix, path) {
    const regexSafePrefix = prefix.replace(/([^\w])/g, '\\$1');
    const cmdCall = new RegExp(`^${regexSafePrefix}([^\\s])+(?=\\s|)`, 'i');
    const badSpaces = /^\s+|\s+$|\s+(?=\s)/g;
    const cmds = loadCommands(path);
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
                            .substring(prefix.length + 1)
                            .replace(badSpaces, '');
                        if (!cmd.permissions.length || hasPermissions(msg.member.permissions, cmd.permissions)) {
                            return yield cmd.execute({ msg, args, cmd });
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
//# sourceMappingURL=DiscordCommandsManager.js.map