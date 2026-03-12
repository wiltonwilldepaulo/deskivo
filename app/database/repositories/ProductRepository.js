import { drizzle } from 'drizzle-orm/node-postgres';
import Connection from '../Connection.js';
import { products } from '../schema.js';

export default class ProductRepository {
    static async insert(data) {
        const client = await Connection.connect();
        const db = drizzle(client);
        try {
            const result = await db.insert(products).values({
                name: data.name,
                price: data.price
            }).returning();
            return result[0];
        } finally {
            client.release();
        }
    }
}