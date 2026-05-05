import { Discord, On, type ArgsOf } from "discordx";
import { db } from "../main.js";

const nSub = ['nigga', 'nigger', 'niggur', 'wigga', 'wigger', 'ngr ', ' ngr']

@Discord()
export class Example {

  @On()
  interactionCreate([interaction]: ArgsOf<"interactionCreate">): void {
    if (interaction.isCommand()) {
      const now = new Date().toLocaleString();
      console.log(`[LISTENER]: ${now} - /${interaction.commandName} by ${interaction.user.username}`)
    }
  }

  @On()
  async messageCreate([message]: ArgsOf<"messageCreate">): Promise<void> {
    const contentLow = message.content.toLowerCase();
    const match = nSub.some(sub => contentLow.includes(sub));
    if (match && message.author.id !== '1499455547785740408' && !message.author.bot) {
      message.reply('nigga detected');
      console.log(`[LISTENER]: #${await db.increaseCount()} - ${message.author.username} said: ${message.content}`);
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
