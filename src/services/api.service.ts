import fetch from 'node-fetch';
import { db } from '../main.js';

const leagueKey = process.env.LEAGUE_KEY;
const giphyKey = process.env.GIPHY_KEY;
const baseUrl = 'https://api.apileague.com/retrieve-random-';
const randomMeme = baseUrl + "meme" + leagueKey;
const randomQuote = baseUrl + "quote" + leagueKey;
const randomTrivia = baseUrl + "trivia" + leagueKey;
const randomRiddle = baseUrl + "riddle" + leagueKey;
const randomJoke = baseUrl + "joke" + leagueKey;
const randomGif = 'https://api.giphy.com/v1/gifs/random' + giphyKey;
const categories: string[] = ['meme', 'trivia', 'riddle', 'quote', 'joke', 'gif']

export class ApiService {

    dailyQuotaCount = 50;

    async getMeme(testCall: boolean = false): Promise<ReqData> {

        const data: ReqData = {
            content: null,
            type: null
        }

        if (this.dailyQuotaCount < 50) {

            data.type = categories[Math.floor(Math.random() * categories.length)];
            let res;
            switch (data.type) {
                case 'meme':
                    res = await fetch(randomMeme);
                    data.content = await res.json() as MemeData
                    break;
                case 'trivia':
                    res = await fetch(randomTrivia);
                    data.content = await res.json() as TriviaData
                    break;
                case 'quote':
                    res = await fetch(randomQuote);
                    data.content = await res.json() as QuoteData
                    break;
                case 'riddle':
                    res = await fetch(randomRiddle);
                    data.content = await res.json() as RiddleData
                    break;
                case 'joke':
                    res = await fetch(randomJoke);
                    data.content = await res.json() as JokeData
                    break;
                case 'gif':
                    res = await fetch(randomGif);
                    data.content = ({ url: ((await res.json() as any).data.images.original.url) } as GifData)
                    break;
                default:
                    throw new Error('Invalid type');
            }

            if (res.status !== 402) {
                this.dailyQuotaCount++;
                if (!testCall) {
                    db.add(data)
                }
            } else {
                console.error('[API]: recevied 402 status')
                await this.fetchCacheFallback(data)
            }
        } else {
            console.info('[API]: reached 50 uses for the day')
            await this.fetchCacheFallback(data);
        }

        console.log(`[API]: Sanity-Check: ${JSON.stringify(data)}`)
        return data;
    }

    private async fetchCacheFallback(data: ReqData) {
        const randomIndex = Math.floor(Math.random() * db.cache.length);
        const fallback = db.cache[randomIndex]
        data.type = fallback.type;
        data.content = fallback.content;
        const now = new Date().toLocaleString();
        console.log(`[API]: ${now} - Cache Fallback used`);
    }
}

export interface JokeData {
    joke: string
}

export interface MemeData {
    description: string;
    url: string;
    type: string,
    width: number,
    height: number,
    ratio: number
}

export interface QuoteData {
    author: string,
    quote: string
}

export interface TriviaData {
    trivia: string
}

export interface RiddleData {
    riddle: string,
    answer: string,
    difficulty: string
}

export interface GifData {
    url: string
}

export interface ReqData {
    content: JokeData | QuoteData | MemeData | RiddleData | TriviaData | GifData | null;
    type: string | null;
}