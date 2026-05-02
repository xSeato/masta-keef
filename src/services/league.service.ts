import fetch from 'node-fetch';

const token = process.env.API_KEY;
const baseUrl = 'https://api.apileague.com/retrieve-random-';
const randomMeme = baseUrl + "meme" + token;
const randomQuote = baseUrl + "quote" + token;
const randomTrivia = baseUrl + "trivia" + token;
const randomRiddle = baseUrl + "riddle" + token;
const randomJoke = baseUrl + "joke" + token;
const categories: string[] = ['meme', 'trivia', 'riddle', 'quote', 'joke']

export class LeagueService {

    dailyQuotaCount = 0;

    private constructor() { }
    static #instance: LeagueService;
    public static get instance(): LeagueService {
        if (!LeagueService.#instance) {
            LeagueService.#instance = new LeagueService();
        }
        return LeagueService.#instance;
    }

    async getMeme(): Promise<ReqData> {

        const data: ReqData = {
            content: null,
            type: categories[Math.floor(Math.random() * categories.length)]
        }

        if (this.dailyQuotaCount <= 50) {

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
                default:
                    throw new Error('Invalid type');
            }
            this.dailyQuotaCount++;
        } else {
            data.content = 'Quota limit';
        }

        console.log(`Sanity-Check: ${JSON.stringify(data)}`)
        return data;
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

export interface ReqData {
    content: JokeData | QuoteData | MemeData | RiddleData | TriviaData | 'Quota limit' | null;
    type: string | null;
}