
import { Pool } from "mysql2/promise";
import { CommentRepository } from "../repositories/comment.repo";

type CreateCommentBody = {
  display_name: string;
  content: string;
};

export class CommentService {
  private repo: CommentRepository;

  constructor(pool: Pool) {
    this.repo = new CommentRepository(pool);
  }

  
  async create(prayerId: number, body: CreateCommentBody) {
    const created = await this.repo.create(
      prayerId,
      body.display_name,
      body.content
    );
    return created;
  }


  async list(prayerId: number, limit: number, offset: number) {
    return this.repo.listByPrayer(prayerId, limit, offset);
  }


  async like(id: number) {
    return this.repo.incrementLike(id); // return updated row or null
  }


  async remove(id: number) {
    await this.repo.remove(id);
  }
}
