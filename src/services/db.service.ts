import { Pool } from 'pg'

const countQuery = 'select * from nig_count';

export class DbService {
    private pool = new Pool({
        connectionString: process.env.SUPABASE,
    })

    static #instance: DbService;
    private constructor() { }
    public static get instance(): DbService {
        if (!DbService.#instance) {
            DbService.#instance = new DbService();
        }
        return DbService.#instance;
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


}
