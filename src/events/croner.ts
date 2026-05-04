import { Cron } from "croner";
import { JokeData, MemeData, QuoteData, ReqData, RiddleData, TriviaData } from "../services/league.service.js";
import { ADMIN_ID, bot } from "../main.js";
import { league } from '../main.js';
import { TextChannel } from "discord.js";

// const channelId = '881442130659270697'
const channelId = '1374081460440666266'
export var jobActive = true;

export class CronService {

  messageJob = new Cron('0 */30 7-21 * * 1-5', async () => {
    await this.sendMessage();
  });

  async sendMessage() {
    if (jobActive) {
      const channel = await bot.channels.fetch(channelId) as TextChannel
      try {
        const req = await league.getMeme();
        const res = await this.handleRequest(req)
        await channel.send(res);
        // await interaction.editReply({embeds: []});
      } catch (error) {
        console.error(error)
        const seato = await (bot.users.fetch(ADMIN_ID))
        await channel.send(`uuuhm... some error occured... ? @${seato.id}`);
      }
    }
  }

  async toggleJob(): Promise<string> {
    if (jobActive) {
      jobActive = false
      return 'Not posting messages until enabled again'
    } else {
      jobActive = true
      return 'Posting messages again'
    }
  }


  async handleRequest(req: ReqData) {
    switch (req.type) {
      case 'meme':
        return `${(req.content as MemeData).url}`;
      case 'trivia':
        return `Random Trivia: \n${(req.content as TriviaData).trivia}`
      case 'quote':
        const quote = (req.content as QuoteData);
        return `${quote.quote} \nQuote by: ${quote.author}`
      case 'riddle':
        const riddle = (req.content as RiddleData)
        return {
          embeds: [{
            title: `‼️ RIDDLE - Difficulty: ${riddle.difficulty}`,
            description: riddle.riddle,
            fields: [
              {
                name: 'Answer',
                value: `||${riddle.answer}||`
              }
            ]
          }]
        }
      case 'joke':
        return (req.content as JokeData).joke;
      default:
        throw new Error('Invalid type');
    }
  }
}
