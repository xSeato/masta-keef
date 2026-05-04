import { Discord, On, type ArgsOf } from "discordx";
import { db } from "../main.js";

const nSub = ['nigga', 'nigger', 'niggur', 'wigga', 'wigger', 'ngr ', ' ngr']

@Discord()
export class Example {

  @On()
  async commandUse([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content.includes('/')) {
      const sub = message.content.split(' ')[0];
      console.log(`${sub} - ${message.author}`);
    }
  }

  @On()
  async messageCreate([message]: ArgsOf<"messageCreate">): Promise<void> {
    const contentLow = message.content.toLowerCase();
    const match = nSub.some(sub => contentLow.includes(sub));
    if (match && message.author.id !== '1499455547785740408' && !message.author.bot) {
      message.reply('nigga detected');
      console.log(`#${await db.increaseCount()} - ${message.author.username} said: ${message.content}`);
    }
  }

  @On()
  async guildCreate([guild]: ArgsOf<"guildCreate">): Promise<void> {
    const channel =
      guild.channels.cache.find(
        (c) =>
          c.isTextBased() &&
          c.permissionsFor(guild.members.me!)?.has('SendMessages')
      );

    if (!channel || !channel.isTextBased()) return;

    await channel.send({
      content:
        `I have arrived. I do not know why I am here.
Use /changelog if you want answers. I might have some.”`
    });
  }
}
