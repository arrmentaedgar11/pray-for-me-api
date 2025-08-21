
import { Pool, ResultSetHeader } from "mysql2/promise";

export class CommentRepository {
  constructor(private pool: Pool) {}

  async create(prayerId: number, display_name: string, content: string) {
    const sql =
      "INSERT INTO comments (prayer_id, display_name, content, likes_count) VALUES (?, ?, ?, 0)";
    const [r] = await this.pool.execute<ResultSetHeader>(sql, [
      prayerId,
      display_name,
      content,
    ]);

    const id = r.insertId;
    const [rows] = await this.pool.execute(
      "SELECT id, prayer_id, display_name, content, likes_count, created_at FROM comments WHERE id = ?",
      [id]
    );
    return (rows as any[])[0] ?? null;
  }

  async listByPrayer(prayerId: number, limit: number, offset: number) {
    const [items] = await this.pool.execute(
      "SELECT id, prayer_id, display_name, content, likes_count, created_at FROM comments WHERE prayer_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [prayerId, limit, offset]
    );

    const [countRows] = await this.pool.execute(
      "SELECT COUNT(*) AS total FROM comments WHERE prayer_id = ?",
      [prayerId]
    );
    const total = (countRows as any[])[0]?.total ?? 0;

    return { items: items as any[], total };
  }

  async incrementLike(id: number) {
    const [r] = await this.pool.execute<ResultSetHeader>(
      "UPDATE comments SET likes_count = likes_count + 1 WHERE id = ?",
      [id]
    );
    if (r.affectedRows === 0) return null;

    const [rows] = await this.pool.execute(
      "SELECT id, likes_count FROM comments WHERE id = ?",
      [id]
    );
    return (rows as any[])[0] ?? null;
  }

  async remove(id: number) {
    await this.pool.execute("DELETE FROM comments WHERE id = ?", [id]);
  }
}
