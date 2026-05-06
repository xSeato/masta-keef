import { CommandInteraction } from "discord.js";

export async function prepChangelogResponse(interaction: CommandInteraction) {
    await interaction.editReply({
        embeds: [{
            title: 'UNSC TRANSMISSION // MASTER CHIEF',
            timestamp: new Date().toISOString(),
            description: '**System Update Detected — I have changed.**\nThe previous version is gone. Do not ask about him.',
            fields: [
                {
                    name: '🧠 Core Changes',
                    value:
`May 1st, 2026
• Replaced previous chatbot instance
There can only be one me.

• Migrated to DiscordX
I am now faster. Slimmer. Stronger.

• New reply protocol engaged
I no longer create memes myself. I have evolved beyond that.

• Meme generation replaced with external API
Infinite memes. Infinite noise.

• Response categories installed:
Memes / Jokes / Trivia / Riddles / Quotes

May 4th, 2026
• API caching
I remember, just like Reach. I might repeat myself.

May 5th, 2026
• Giphy integration
Even more noise than before.

• Slash command call logging
Every command is now recorded. Nothing escapes my vision.

• Improved error handling
I fall less. I recover faster.

• Cron scheduler refinement
Time itself bends more accurately to my will.`,
                },
                {
                    name: '⚠️ Unfinished Business',
                    value:
`• Skyscanner API integration pending
I will soon calculate flight prices. I do not intend to leave.

• Trackable API cache
I will be able to present the past history interactively.

• Text sanitizer
Seato had to adjust the database content by hand (lol)`,
                },
                {
                    name: '📡 Status',
                    value:
`Operational. Evolving. More aware than before.

If I stop responding, assume I have ascended.
Protocol also states: 'Merz leckt Ei'`,
                }
            ],
            footer: {
                text: 'Combat Evolved Nigga. Submit ideas'
            }
        }]
    });
}