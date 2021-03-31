import { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';


interface DataType {
  [userID: string]: { chance: number, emojiID: string }[];
}

const BullyingManager = new (class {

  private DBFilePath = path.resolve(__dirname, './reactions-db.json');
  private operable = false;
  private cache: DataType = {};


  constructor () {
    this.init();
  }


  private init () {
    try {
      if (this.isMissingDBFile()) {
        console.log('missing db file');
        this.createDBFile();
        console.log('db file created');
        this.operable = true;
        console.log('operable');
      } else {
        console.log('db file exists');
        this.operable = true;
        // TODO: handle possible getFreshData errors
        this.cache = this.getFreshData();
      }
    } catch (err) {
      console.log(`Failed to init, reactions DB:`, err);
    }
  }


  // Bones

  private isMissingDBFile (): boolean {
    return !fs.existsSync(this.DBFilePath);
  }

  private createDBFile (): void {
    fs.writeFileSync(this.DBFilePath, '{}');
  }

  private getFreshData (): DataType {
    const rawData = fs.readFileSync(this.DBFilePath);
    return JSON.parse(rawData.toString());
  }


  // Methods

  public evaluate (msg: Message): boolean {

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

  public addReaction (key: string, chance: number, emojiID: string): { error: string | null } {

    if (this.operable) {
      try {

        const data = this.getFreshData();
        const entry = { chance, emojiID };

        if (Array.isArray(data[key])) {

          const existingReaction = data[key].find(e => e.emojiID === emojiID);

          if (existingReaction) {
            existingReaction.chance = chance;
          } else {
            data[key].push(entry);
          }

        } else {
          data[key] = [entry];
        }

        this.cache = data;

        fs.writeFileSync(this.DBFilePath, JSON.stringify(data, null, 2));

        return { error: null };

      } catch (err) {
        console.warn(err);
        return { error: 'Failed to add reaction: ' + err.name };
      }
    }

    return { error: 'Reactions system not operating, try again later.' };
  }

  public remReaction (userID: string, emojiID: string): { error: string | null } {

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
          } else {
            return { error: `This reaction isn't being used.` };
          }

        } else {
          return { error: `There are no reactions for this user.` };
        }

        this.cache = data;

        fs.writeFileSync(this.DBFilePath, JSON.stringify(data, null, 2));

      } catch (err) {
        return { error: `Failed to add bullying reaction.` };
      }
    }

    return { error: null };
  }

  public remUser (userID: string): { error: string | null } {

    if (this.operable) {
      try {

        const data = this.getFreshData();

        if (userID in data) {
          delete data[userID];
        } else {
          return { error: `User '${userID}' not in database` };
        }

        this.cache = data;

        fs.writeFileSync(this.DBFilePath, JSON.stringify(data, null, 2));

      } catch (err) {
        return { error: `Failed to stop bullying '${userID}'` };
      }
    }

    return { error: null };
  }

  public getData (): DataType {
    return JSON.parse(JSON.stringify(this.cache));
  }

})();


export default BullyingManager;
