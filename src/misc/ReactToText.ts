import { Client } from 'discord.js';

export default class ReactToText {

  private tests: [string | RegExp, string][] = [];

  constructor (client: Client) {
    client.on('message', msg => {
      for (const [test, reaction] of this.tests) {
        if (typeof test === 'string') {
          if (msg.content.includes(test)) {
            msg.react(reaction).catch();
          }
        } else {
          if (test.test(msg.content)) {
            msg.react(reaction).catch();
          }
        }
      }
    });
  }

  public add (test: string | RegExp, reaction: string) {
    this.tests.push([test, reaction]);
  }

}
