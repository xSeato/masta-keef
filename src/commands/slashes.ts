import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { prepChangelogResponse } from "../services/changelog.service.js";
import { jobActive } from '../events/croner.js'
import { ADMIN_ID, croner, spotify } from '../main.js';


@Discord()
export class SlashCommands {

  // dev purpose
  @Slash({ name: 'test-spotify', description: "dev-only" })
  async testSpotify(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    if (interaction.user.id == ADMIN_ID) {
      await croner.postSpotifyTopTen();
      await interaction.editReply(`done.`);
    } else {
      await interaction.editReply(`You're not the dev? lol`);
    }
  }

  // dev purpose
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

  @Slash({ name: 'top-10', description: "Top-10 from the last 4 weeks of the timestamp of the request" })
  async getSpotifyLastMonth(
    @SlashOption({
      description: "Valid values: kishi, doubt, seato",
      name: "user",
      required: true,
      type: ApplicationCommandOptionType.String,
    }) user: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();
    try {
      const tracks = await spotify.getTopTracks(user.toLowerCase());

      const trackList = tracks.map((track, index) => `${index + 1}. **${track.name}** - ${track.artists[0].name}`).join('\n');

      await interaction.editReply({
        content: `🎵 **Top 10 from ${user}:**\n\n${trackList}`
      });
    } catch (error) {
      await interaction.editReply({ content: "Fehler beim Abrufen der Spotify-Daten." });
      console.error(error);
    }
  }
}


