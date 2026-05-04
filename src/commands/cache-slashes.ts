import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { db } from '../main.js';

@Discord()
export class CacheCommands {


    @Slash({ name: 'get-cache-count', description: "prints amount of past messages" })
    async getCacheCount(interaction: CommandInteraction): Promise<void> {
        await interaction.deferReply();

        let memes = 0, jokes = 0, quotes = 0, trivias = 0, riddles = 0;
        let nigs = (await db.getNigCount())
        db.cache.forEach(e => {
            switch (e.type) {
                case 'meme': memes++; break;
                case 'trivia': trivias++; break;
                case 'quote': quotes++; break;
                case 'riddle': riddles++; break;
                case 'joke': jokes++; break;
                default: break;
            }
        })

        await interaction.editReply({
            embeds: [{
                title: 'Category Count',
                description: 'Feature added: 2026-05-04 / 20:00',
                fields: [
                    { name: 'Jokes', value: String(jokes), inline: true},
                    { name: 'Quotes', value: String(quotes), inline: true},
                    { name: 'Memes', value: String(memes), inline: true},
                    { name: 'Trivia', value: String(trivias), inline: true},
                    { name: 'Riddles', value: String(riddles), inline: true},
                    { name: 'N-Words', value: String(nigs), inline: true},
                ]
            }]
        });
    }


}