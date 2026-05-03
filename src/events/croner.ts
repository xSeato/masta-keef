import { Cron } from "croner";
import { JokeData, LeagueService, MemeData, QuoteData, ReqData, RiddleData, TriviaData } from "../services/league.service.js";
import { bot } from "../main.js";
import { TextChannel } from "discord.js";

const leagueApi = LeagueService.instance;
// const channelId = '881442130659270697'
const channelId = '1374081460440666266'
export var jobActive = true;

export const messageJob = new Cron('0 */30 7-21 * * 1-5', async () => {
    await sendMessage();
});

export async function sendMessage() {
    if (jobActive) {

        const channel = await bot.channels.fetch(channelId) as TextChannel
        try {
            const req = await leagueApi.getMeme();
            const res = await handleRequest(req)

            await channel.send(res);
            // await interaction.editReply({embeds: []});
        } catch (error) {
            console.error(error)
            await channel.send(`Quota limit?`);
        }
    }
}

export async function toggleJob(): Promise<string> {
    if (jobActive) {
        jobActive = false
        return 'Not posting messages until enabled again'
    } else {
        jobActive = true
        return 'Posting messages again'
    }
}


async function handleRequest(req: ReqData) {
  // const res: ResData = { type: req.type, content: '' }
  if (req.content == 'Quota limit') {
    return 'Quota limit reached buddy'
  }

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