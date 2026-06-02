export class SpotifyService {
    private clientId: string | undefined;
    private clientSecret: string | undefined;
    private userTokens: Record<string, string>;

    constructor() {
        this.clientId = process.env.MUSIC_KEY;
        this.clientSecret = process.env.MUSIC_SECRET;
        this.userTokens = {
            'seato': process.env.SEATO_TOKEN!,
            'kishi': process.env.KISHL_TOKEN!,
            'doubt': process.env.DOUBT_TOKEN!,
        };
    }

    private async getAccessToken(userKey: string): Promise<string> {
        const refreshToken = this.userTokens[userKey];
        if (!refreshToken) throw new Error("User nicht konfiguriert.");

        const payload = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        if (!response.ok) {
            console.log(`response status: ${response.status}`)
            console.log(`response statustext: ${response.statusText}`)
            console.log(`response text: ${await response.text()}`)
        }

        const data = await response.json();
        return data.access_token;
    }


    public async getTopTracks(userKey: string): Promise<any[]> {
        const accessToken = await this.getAccessToken(userKey);

        // time_range 'short_term' entspricht den letzten ca. 4 Wochen (aktueller Monat)
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        const now = new Date().toLocaleString();
        console.log(`[SPOTIFY]: ${now} - API request made for: ${userKey}`)

        return data.items; // Array von Track-Objekten
    }
}