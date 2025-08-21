import { Pool } from "mysql2/promise";
import { CategoryRepository } from "../repositories/category.repo";


export class CategoryService {
private repo: CategoryRepository;
constructor(pool: Pool) { this.repo = new CategoryRepository(pool); }
list() { return this.repo.list(); }
create(name: string) { return this.repo.create(name); }
}