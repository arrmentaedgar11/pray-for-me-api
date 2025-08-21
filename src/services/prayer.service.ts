import { Pool } from "mysql2/promise";
import { PrayerRepository } from "../repositories/prayer.repo";

export class PrayerService {
  private repo: PrayerRepository;
  constructor(pool: Pool) {
    this.repo = new PrayerRepository(pool);
  }

  list(filters: { status?: string; category?: number; is_private?: boolean; limit: number; offset: number }) {
    return this.repo.list(filters);
  }

  get(id: number) {
    return this.repo.findById(id);
  }

  async create(data: { title: string; description: string; is_private: boolean; status: string; categoryIds: number[] }) {
    const created = await this.repo.create(data);
    if (!created) return null;
    if (data.categoryIds?.length) await this.repo.replaceCategories(created.id, data.categoryIds);
    return this.get(created.id);
  }

  async update(
    id: number,
    patch: Partial<{ title: string; description: string; is_private: boolean; status: string; categoryIds: number[] }>
  ) {
    if (patch.status === "answered") {
      await this.repo.update(id, { status: "answered", answered_at: new Date() });
    }
    const updated = await this.repo.update(id, patch);
    if (patch.categoryIds) await this.repo.replaceCategories(id, patch.categoryIds);
    return updated;
  }

  remove(id: number) { return this.repo.remove(id); }

  incrementPrayedCount(id: number) { return this.repo.incrementPrayed(id); }

  categories(prayerId: number) { return this.repo.findCategories(prayerId); }

  comments(prayerId: number, limit: number, offset: number) { return this.repo.findComments(prayerId, limit, offset); }
}
