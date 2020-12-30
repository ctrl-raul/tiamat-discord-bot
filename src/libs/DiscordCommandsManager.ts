import Discord from 'discord.js';
import _path from 'path';
import fs from 'fs';


interface Commands {
  [key: string]: LoadedCommandModule;
}

export interface CommandExecuteArguments {
  msg: Discord.Message;
  args: string;
  cmd: LoadedCommandModule;
  prefix: string;
  onError: (err: Error) => void;
}

export interface CommandModule {
  enabled?: boolean;
  name?: string;
  permissions?: Discord.PermissionString | Discord.PermissionString[];
  execute: (cea: CommandExecuteArguments) => any;
}

interface LoadedCommandModule extends CommandModule {
  permissions: Discord.PermissionString[];
  name: string;
  enabled: boolean;
  path: string;
}


function loadCommands (path: string, cmds: Commands = {}) {

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
    loadCommands(_path.join(path, dir), cmds);
  }

  return cmds;
}


export function hasPermissions (permissions: Readonly<Discord.Permissions>, required: Discord.PermissionString[]) {
	for (let x of required) {
    if (permissions.has(x)) {
      return true;
    }
  }
	return false;
}


export default function (prefix: string, path: string, logs: boolean = false) {

  const regexSafePrefix = prefix.replace(/([^\w])/g, '\\$1');
	const cmdCall = new RegExp(`^${regexSafePrefix}([^\\s])+(?=\\s|)`, 'i');
  const badSpaces = /^\s+|\s+$|\s+(?=\s)/g;
  
  const cmds = loadCommands(path);

  const errorLogger = (err: Error, cmd: CommandModule) => {
    console.error(`Failed to execute command '${cmd.name}':`, err);
  };

  return {

    cmds,

    async evaluate (msg: Discord.Message): Promise<boolean> {

      const match = msg.content.match(cmdCall);
  
      if (!match) {
        return false;
      }
  
      const cmdName = match[0].substring(prefix.length);
      const cmd = cmds[cmdName];
  
      if (typeof cmd !== 'undefined') {

        if (!cmd.enabled) {
          msg.react('❌');
          return true;
        }
  
        if (msg.member) {
  
          const args = msg.content
            .substring(prefix.length + cmd.name.length) // Remove command call
            .replace(badSpaces, ''); // Remove multiple spaces
            
          if (!cmd.permissions.length || hasPermissions(msg.member.permissions, cmd.permissions)) {

            if (logs) {
              console.log('Executing command', cmd.name);
            }

            cmd.execute({
              msg,
              args,
              cmd,
              prefix,
              onError: (err: Error) => errorLogger(err, cmd)
            });

          } else {
            msg.react('❌');
          }
        }
  
      }
  
      return false;
    }

  };
}
