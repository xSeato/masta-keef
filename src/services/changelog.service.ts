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

May 5th, 2026
• API caching
I remember, just like Reach. I might repeat myself`,
                },
                {
                    name: '⚠️ Unfinished Business',
                    value:
`• No daily limiter
I currently have no restraint.

• Better error handling
I will die depending on the severity of Exception.

• Skyscanner API integration pending
I will soon calculate flight prices. I do not intend to leave.

• API caching not visible
I will be able to present the past history interactively.`,
                },
                {
                    name: '📡 Status',
                    value:
`Operational. Evolving. Slightly less unstable than last time.

If I stop responding, assume I have ascended.
Protocol also states: 'Merz leckt Ei'`,
                }
            ],
            footer: {
                text: 'Combat Evolved Nigga'
            }
        }]
    });
}