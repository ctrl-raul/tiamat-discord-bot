import Discord from 'discord.js';
import _path from 'path';
import fs from 'fs';


interface Commands {
  [key: string]: LoadedCommandModule;
}

interface CommandExecuteArguments {
  msg: Discord.Message;
  args: string;
  cmd: LoadedCommandModule;
}

export interface CommandModule {
  name: string;
  permissions: Discord.PermissionString[];
  execute: (cea: CommandExecuteArguments) => (boolean | Promise<boolean>);
}

interface LoadedCommandModule extends CommandModule {
  path: string;
}


function loadCommands (path: string, cmds: Commands = {}) {

  const contents = fs.readdirSync(_path.resolve(path));

  // const isTSfile = /\.(?=ts$)/;

  const subdirs: string[] = [];
  const files: string[] = [];


  for (const dir of contents) {

    const filePath = _path.join(path, dir);
    
    if (fs.lstatSync(filePath).isDirectory()) {
      subdirs.push(filePath);
    } else {
      files.push(filePath);
    }
  }

  for (const filePath of files) {

    const cmdModule: CommandModule = require(filePath).default;

    if (cmds.hasOwnProperty(cmdModule.name)) {

      const message = [
        `found two commands with the name '${cmdModule.name}'`,
        '  command paths:',
        '  ' + cmds[cmdModule.name].path,
        '  ' + filePath,
        ''
      ].join('\n');

      throw new Error(message);

    } else if (cmdModule.name in cmds) {

      const message = [
        `'${cmdModule.name}' cannot be used as a command name because it overrides a built-in Object property`,
        '  command path:',
        '  ' + filePath,
        ''
      ].join('\n');

      throw new Error(message);
    }

    cmds[cmdModule.name] = {
      path: filePath,
      ...cmdModule
    };

  }

  for (const dir of subdirs) {
    console.log(dir)
    loadCommands(dir, cmds);
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


export default function (prefix: string, path: string) {

  const regexSafePrefix = prefix.replace(/([^\w])/g, '\\$1');
	const cmdCall = new RegExp(`^${regexSafePrefix}([^\\s])+(?=\\s|)`, 'i');
  const badSpaces = /^\s+|\s+$|\s+(?=\s)/g;
  
  const cmds = loadCommands(path);

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
  
        if (msg.member) {
  
          const args = msg.content
            .substring(prefix.length + 1) // Remove command call
            .replace(badSpaces, ''); // Remove multiple spaces
            
          if (!cmd.permissions.length || hasPermissions(msg.member.permissions, cmd.permissions)) {
            return await cmd.execute({ msg, args, cmd });
          } else {
            msg.react('❌');
          }
        }
  
      }
  
      return false;
    }

  }
}
