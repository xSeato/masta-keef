import { Pool, QueryResult } from 'pg'
import { ReqData } from './api.service.js';

const countQuery = 'select * from nig_count';

export class DbService {

    cache: ReqData[] = []
    private pool = new Pool({
        connectionString: process.env.SUPABASE,
    })

    constructor() {
        this.pool.connect(async () => {
            console.log(`[DB]: Connected!`);
            const res = await this.pool.query('SELECT type, content FROM api_responses ORDER BY id DESC');
            await this.loadRecentCache(res);
        })
    }

    async getNigCount() {
        const count = (await this.pool.query<{ id: number, count: number }>(countQuery)).rows[0].count;
        return count;
    }

    async increaseCount() {
        const count = (await this.pool.query<{ id: number, count: number }>(countQuery)).rows[0].count;
        this.pool.query(`update nig_count set count=${count + 1} where id=1`)
        return count + 1;
    }

    async add(item: ReqData) {
        this.cache.push(item);
        try {
            const query = `INSERT INTO api_responses (type, content) VALUES ($1, $2)`;
            const values = [item.type, JSON.stringify(item.content)]; // Stringify JSON objects!

            await this.pool.query(query, values);
            console.log(`[DB]: Saved ${item.type} to database`);
        } catch (error) {
            console.error(`[DB]: Error saving ${item.type}:`, error);
        }
    }

    // Get by ID (for your /cache-get command)
    async getById(id: number): Promise<ReqData | null> {
        // Check memory cache first (faster)
        if (id <= this.cache.length && id > 0) {
            console.log(`[DB]: Cache hit for ID ${id}`);
            return this.cache[id - 1];
        }

        // Fallback to database
        const result = await this.pool.query(`SELECT * FROM api_responses WHERE id = ${id}`);

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            type: row.type,
            content: row.content
        } as ReqData;
    }

    async getTotalCount(): Promise<number> {
        const res = await this.pool.query('SELECT COUNT(*) as total FROM api_responses');
        return parseInt(res.rows[0].total);
    }

    private async loadRecentCache(result: QueryResult<any>): Promise<void> {
        // Clear existing cache (if any)
        this.cache = [];

        // Load in reverse to maintain chronological order
        for (let i = result.rows.length - 1; i >= 0; i--) {
            const row = result.rows[i];
            this.cache.push({
                type: row.type,
                content: row.content
            } as ReqData);
        }

        console.log(`[DB]: Loaded ${this.cache.length} recent entries into cache`);
    }
}
