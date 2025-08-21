import { Pool } from "mysql2/promise";


export class CategoryRepository {
constructor(private pool: Pool) {}


async list() {
const [rows] = await this.pool.query("SELECT * FROM categories ORDER BY name");
return rows as { id: number; name: string }[];
}


async create(name: string) {
const [res] = await this.pool.execute("INSERT INTO categories (name) VALUES (?)", [name]);
// @ts-ignore
const id = res.insertId as number;
return { id, name };
}
}