import Discord from 'discord.js';
import _path from 'path';
import fs from 'fs';


interface Commands {
  [key: string]: Command;
}

export interface CommandExecuteArguments {
  msg: Discord.Message;
  args: string;
  cmd: Command;
  prefix: string;
  onError: (err: Error) => void;
}

export interface CommandModule {
  enabled?: boolean;
  name?: string;
  permissions?: Discord.PermissionString | Discord.PermissionString[];
  execute: (cea: CommandExecuteArguments) => any;
}

interface Command extends CommandModule {
  permissions: Discord.PermissionString[];
  name: string;
  enabled: boolean;
  path: string;
}


export class CmdEvalFail {
  name: keyof CommandsManager['MessageEvaluationErrors'];
  constructor (name: CmdEvalFail['name']) {
    this.name = name;
  }
}

export default class CommandsManager {

  private prefix: string;
  public commands: Commands;
  private onExecutingCommand: (command: Command) => unknown;
  private onCommandExecutionError: (command: Command, error: Error) => unknown;

  // Matches trailling, leading and repeated spaces
  private matchTrivialSpaces = /^\s+|\s+$|\s+(?=\s)/g;

  public MessageEvaluationErrors = {
    PRIVATE_MESSAGE: 'PRIVATE_MESSAGE',
    NOT_A_COMMAND_CALL: 'NOT_A_COMMAND_CALL',
    COMMAND_DOES_NOT_EXIST: 'COMMAND_DOES_NOT_EXIST',
    COMMAND_DISABLED: 'COMMAND_DISABLED',
    MISSING_PERMISSIONS: 'MISSING_PERMISSIONS',
  };


  constructor (config: {
    prefix: string;
    commandsDir: string;
    onExecutingCommand: CommandsManager['onExecutingCommand'];
    onCommandExecutionError: CommandsManager['onCommandExecutionError'];
  }) {
    this.prefix = config.prefix;
    this.commands = this.loadCommands(config.commandsDir);
    this.onExecutingCommand = config.onExecutingCommand;
    this.onCommandExecutionError = config.onCommandExecutionError;
  }


  // Methods

  public hasPermissions (granted: Readonly<Discord.Permissions>, required: Discord.PermissionString[]) {
    for (let x of required) {
      if (granted.has(x)) {
        return true;
      }
    }
    return false;
  }

  public evaluate (msg: Discord.Message): CmdEvalFail | null {

    // Ignores PMs
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
      .substring(this.prefix.length + cmd.name.length) // Remove command call
      .replace(this.matchTrivialSpaces, '');

    cmd.execute({
      msg,
      args,
      cmd,
      prefix: this.prefix,
      onError: (err: Error) => this.onCommandExecutionError(cmd, err),
    });

    return null;
  }


  // Class functions

  private loadCommands (path: string, cmds: Commands = {}) {

    const contents = fs.readdirSync(_path.resolve(path));
    const subdirs: string[] = [];
    const files: string[] = [];
  
  
    for (const x of contents) {    
      if (fs.lstatSync(_path.join(path, x)).isDirectory()) {
        subdirs.push(x);
      } else {
        files.push(x);
      }
    }
  
    for (const fileName of files) {
  
      const filePath = _path.join(path, fileName);
      const required = require(filePath);
      const cmdModule: CommandModule = required.default;
  
      cmdModule.name ??= fileName.replace(/\.\w+$/i, '');
  
      if (cmds.hasOwnProperty(cmdModule.name)) {
  
        const messageLines = [
          `found two commands with the name '${cmdModule.name}'`,
          '  command paths:',
          '  ' + cmds[cmdModule.name].path,
          '  ' + filePath,
          ''
        ];
  
        throw new Error(messageLines.join('\n'));
  
      } else if (cmdModule.name in cmds) {
  
        const messageLines = [
          `'${cmdModule.name}' cannot be used as a command name because it overrides a built-in Object property`,
          '  command path:',
          '  ' + filePath,
          ''
        ];
  
        throw new Error(messageLines.join('\n'));
      }
  
      const permissions: Discord.PermissionString[] = (
        !cmdModule.permissions
        ? []
        : (typeof cmdModule.permissions === 'string'
          ? [cmdModule.permissions]
          : cmdModule.permissions
          )
      );
  
      cmds[cmdModule.name] = {
  
        name: cmdModule.name,
        execute: cmdModule.execute,
        enabled: cmdModule.enabled ?? true,
  
        path: filePath,
        permissions,
  
      };
  
    }
  
    for (const dir of subdirs) {
      this.loadCommands(_path.join(path, dir), cmds);
    }
  
    return cmds;
  }

}
