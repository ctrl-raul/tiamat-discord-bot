import embedLink from '../../utils/embedLink';
import { CommandModule } from '../../CommandsManager';


const command: CommandModule = {

  execute (args) {

    const { msg, onError } = args;

    const embed = embedLink(
      'Report a potential Cheater',
      'https://docs.google.com/forms/d/e/1FAIpQLSdpTi7ARgV-5ncdfXi2QzEOUXGlSM-1XN6IrMqyjknFyk0yxA/viewform',
      '#aaaaaa',
      args
    );

    msg.channel.send(embed).catch(onError);
    msg.delete().catch();

  }

};


export default command;
