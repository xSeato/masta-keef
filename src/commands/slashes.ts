import { type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { prepChangelogResponse } from "../services/changelog.service.js";
import { jobActive } from '../events/croner.js'
import { ADMIN_ID, croner } from '../main.js';


@Discord()
export class SlashCommands {


  @Slash({ name: 'test-print', description: "dev-only" })
  async testRandomOutput(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    if (interaction.user.id == ADMIN_ID) {
      await croner.sendMessage(true);
      await interaction.editReply('Test success')
    } else {
      await interaction.editReply(`You're not the dev? lol`);
    }
  }

  // @Slash({ name: '', description: "how many times have you sinned?" })
  // async count(interaction: CommandInteraction): Promise<void> {
  //   await interaction.reply(`N-Word Count: ${(await dbService.getNigCount())}`);
  // }

  @Slash({ description: "see latest changes and open To-Do's" })
  async changelog(interaction: CommandInteraction) {
    await interaction.deferReply();
    await prepChangelogResponse(interaction);
  }

  @Slash({ description: "Dis- or Re-enable the random messages" })
  async toggle(interaction: CommandInteraction) {
    const status = await croner.toggleJob();
    await interaction.reply(`Job set to: ${jobActive}. ${status}`);
  }
}


