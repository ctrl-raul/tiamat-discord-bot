"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmdEvalFail = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CmdEvalFail {
    constructor(name) {
        this.name = name;
    }
}
exports.CmdEvalFail = CmdEvalFail;
class CommandsManager {
    constructor(config) {
        this.matchTrivialSpaces = /^\s+|\s+$|\s+(?=\s)/g;
        this.MessageEvaluationErrors = {
            PRIVATE_MESSAGE: 'PRIVATE_MESSAGE',
            NOT_A_COMMAND_CALL: 'NOT_A_COMMAND_CALL',
            COMMAND_DOES_NOT_EXIST: 'COMMAND_DOES_NOT_EXIST',
            COMMAND_DISABLED: 'COMMAND_DISABLED',
            MISSING_PERMISSIONS: 'MISSING_PERMISSIONS',
        };
        this.prefix = config.prefix;
        this.commands = this.loadCommands(config.commandsDir);
        this.onExecutingCommand = config.onExecutingCommand;
        this.onCommandExecutionError = config.onCommandExecutionError;
    }
    hasPermissions(granted, required) {
        for (let x of required) {
            if (granted.has(x)) {
                return true;
            }
        }
        return false;
    }
    evaluate(msg) {
        if (!msg.member) {
            return new CmdEvalFail('PRIVATE_MESSAGE');
        }
        if (msg.content.indexOf(this.prefix) !== 0) {
            return new CmdEvalFail('NOT_A_COMMAND_CALL');
        }
        const cmdName = msg.content.split(' ')[0].substring(this.prefix.length);
        if (!this.commands.hasOwnProperty(cmdName)) {
            return new CmdEvalFail('COMMAND_DOES_NOT_EXIST');
        }
        const cmd = this.commands[cmdName];
        if (!cmd.enabled) {
            return new CmdEvalFail('COMMAND_DISABLED');
        }
        if (cmd.permissions.length) {
            if (!this.hasPermissions(msg.member.permissions, cmd.permissions)) {
                return new CmdEvalFail('MISSING_PERMISSIONS');
            }
        }
        this.onExecutingCommand(cmd);
        const args = msg.content
            .substring(this.prefix.length + cmd.name.length)
            .replace(this.matchTrivialSpaces, '');
        cmd.execute({
            msg,
            args,
            cmd,
            prefix: this.prefix,
            onError: (err) => this.onCommandExecutionError(cmd, err),
        });
        return null;
    }
    loadCommands(path, cmds = {}) {
        var _a, _b;
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
                enabled: (_b = cmdModule.enabled) !== null && _b !== void 0 ? _b : true,
                path: filePath,
                permissions,
            };
        }
        for (const dir of subdirs) {
            this.loadCommands(path_1.default.join(path, dir), cmds);
        }
        return cmds;
    }
}
exports.default = CommandsManager;
