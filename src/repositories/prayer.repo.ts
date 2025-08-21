import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

type Filters = {
  status?: string;
  category?: number;
  is_private?: boolean;
  limit: number;
  offset: number;
};

type PrayerRow = {
  id: number;
  title: string;
  description: string;
  status: string;
  is_private: number;
  prayed_count: number;
  created_at: Date;
  answered_at: Date | null;
};

export class PrayerRepository {
  constructor(private pool: Pool) {}

  async list(filters: Filters) {
    const { status, category, is_private, limit, offset } = filters;

    const where: string[] = [];
    const params: any[] = [];

    if (status) {
      where.push("p.status = ?");
      params.push(status);
    }
    if (typeof is_private === "boolean") {
      where.push("p.is_private = ?");
      params.push(is_private ? 1 : 0);
    }
    if (category) {
      where.push(
        "EXISTS (SELECT 1 FROM prayer_categories pc WHERE pc.prayer_id = p.id AND pc.category_id = ?)"
      );
      params.push(category);
    }

    const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";

    const [rows] = await this.pool.execute<(PrayerRow & RowDataPacket)[]>(
      `
      SELECT p.*
      FROM prayers p
      ${whereSql}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [[countRow]] = await this.pool.execute<(RowDataPacket & { total: number })[]>(
      `
      SELECT COUNT(*) AS total
      FROM prayers p
      ${whereSql}
      `,
      params
    );

    return { items: rows, total: (countRow as any).total as number };
  }

  async findById(id: number) {
    const [rows] = await this.pool.execute<(PrayerRow & RowDataPacket)[]>(
      "SELECT * FROM prayers WHERE id = ?",
      [id]
    );
    return rows[0] ?? null;
  }

  async create(data: {
    title: string;
    description: string;
    is_private: boolean;
    status: string;
  }) {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
      INSERT INTO prayers (title, description, status, is_private, prayed_count, created_at)
      VALUES (?, ?, ?, ?, 0, NOW())
      `,
      [data.title, data.description, data.status, data.is_private ? 1 : 0]
    );
    const id = result.insertId;
    return this.findById(id);
  }

  async replaceCategories(prayerId: number, categoryIds: number[]) {
    await this.pool.execute("DELETE FROM prayer_categories WHERE prayer_id = ?", [prayerId]);
    if (categoryIds.length === 0) return;

    const values = categoryIds.map(() => "(?, ?)").join(", ");
    const params: any[] = [];
    for (const cid of categoryIds) {
      params.push(prayerId, cid);
    }
    await this.pool.execute(
      `INSERT INTO prayer_categories (prayer_id, category_id) VALUES ${values}`,
      params
    );
  }

  async update(
    id: number,
    patch: Partial<{
      title: string;
      description: string;
      is_private: boolean;
      status: string;
      answered_at: Date | null;
    }>
  ) {
    const sets: string[] = [];
    const params: any[] = [];

    if (patch.title !== undefined) {
      sets.push("title = ?");
      params.push(patch.title);
    }
    if (patch.description !== undefined) {
      sets.push("description = ?");
      params.push(patch.description);
    }
    if (patch.is_private !== undefined) {
      sets.push("is_private = ?");
      params.push(patch.is_private ? 1 : 0);
    }
    if (patch.status !== undefined) {
      sets.push("status = ?");
      params.push(patch.status);
    }
    if (patch.answered_at !== undefined) {
      sets.push("answered_at = ?");
      params.push(patch.answered_at);
    }

    if (sets.length === 0) {
      return this.findById(id);
    }

    params.push(id);

    await this.pool.execute(
      `UPDATE prayers SET ${sets.join(", ")} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }

  async remove(id: number) {
    await this.pool.execute("DELETE FROM prayer_categories WHERE prayer_id = ?", [id]);
    await this.pool.execute("DELETE FROM comments WHERE prayer_id = ?", [id]);
    await this.pool.execute("DELETE FROM prayers WHERE id = ?", [id]);
  }

  async incrementPrayed(id: number) {
    const [result] = await this.pool.execute<ResultSetHeader>(
      "UPDATE prayers SET prayed_count = prayed_count + 1 WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) return null;
    const row = await this.findById(id);
    return row?.prayed_count ?? null;
  }

  async findCategories(prayerId: number) {
    const [rows] = await this.pool.execute<(RowDataPacket & { id: number; name: string })[]>(
      `
      SELECT c.id, c.name
      FROM categories c
      INNER JOIN prayer_categories pc ON pc.category_id = c.id
      WHERE pc.prayer_id = ?
      ORDER BY c.name ASC
      `,
      [prayerId]
    );
    return rows;
  }

  async findComments(prayerId: number, limit: number, offset: number) {
    const [rows] = await this.pool.execute<(RowDataPacket & any)[]>(
      `
      SELECT id, prayer_id, display_name, content, likes_count, created_at
      FROM comments
      WHERE prayer_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [prayerId, limit, offset]
    );

    const [[countRow]] = await this.pool.execute<(RowDataPacket & { total: number })[]>(
      "SELECT COUNT(*) AS total FROM comments WHERE prayer_id = ?",
      [prayerId]
    );

    return { items: rows, total: (countRow as any).total as number };
  }
}
