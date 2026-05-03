import { type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { DbService } from "../services/db.service.js";
import { prepChangelogResponse } from "../services/changelog.service.js";
import { toggleJob, jobActive, sendMessage } from '../events/croner.js'
const adminId = '198918288351297537';
const dbService = DbService.instance;

@Discord()
export class Example {
  @Slash({ description: "dev-only" })
  async test_random_output(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    if (interaction.user.id == adminId) {
      await sendMessage();
      await interaction.editReply('Test success')
    } else {
      await interaction.editReply(`You're not the dev? lol`);
    }
  }

  @Slash({ description: "how many times have you sinned?" })
  async count(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(`N-Word Count: ${(await dbService.getNigCount())}`);
  }

  @Slash({ description: "see latest changes and open To-Do's" })
  async changelog(interaction: CommandInteraction) {
    await interaction.deferReply();
    await prepChangelogResponse(interaction);
  }

  @Slash({ description: "Dis- or Re-enable the random messages" })
  async toggle(interaction: CommandInteraction) {
    const status = await toggleJob();
    await interaction.reply(`Job set to: ${jobActive}. ${status}`);
  }
}


