// Angular
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

// App models
import { Prayer, ListResponse } from '../core/models/prayer.model';

@Injectable({ providedIn: 'root' })
export class PrayersService {
  private base = environment.apiBaseUrl;


  async list(limit = 10, offset = 0): Promise<ListResponse<Prayer>> {
    const url = `${this.base}/prayers?offset=${offset}&limit=${limit}`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) throw new Error(`Failed to fetch prayers: ${resp.status}`);
    return (await resp.json()) as ListResponse<Prayer>;
  }


  async get(id: number): Promise<Prayer | null> {
    const resp = await fetch(`${this.base}/prayers/${id}`, {
      headers: { Accept: 'application/json' },
    });
    if (resp.status === 404) return null;
    if (!resp.ok) throw new Error(`Failed to fetch prayer #${id}: ${resp.status}`);
    return (await resp.json()) as Prayer;
  }


  async create(data: Partial<Prayer>): Promise<Prayer> {
    const resp = await fetch(`${this.base}/prayers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw new Error(`Failed to create prayer: ${resp.status}`);
    return (await resp.json()) as Prayer;
  }


  async update(id: number, data: Partial<Prayer>): Promise<Prayer> {
    const resp = await fetch(`${this.base}/prayers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw new Error(`Failed to update prayer #${id}: ${resp.status}`);
    return (await resp.json()) as Prayer;
  }


  async pray(id: number): Promise<Prayer> {
    const resp = await fetch(`${this.base}/prayers/${id}/pray`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) throw new Error(`Failed to increment pray on #${id}: ${resp.status}`);
    return (await resp.json()) as Prayer;
  }
}
