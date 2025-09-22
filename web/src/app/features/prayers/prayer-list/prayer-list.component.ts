// web/src/app/features/prayers/prayer-list/prayer-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PrayersService } from '../../../services/prayer.service';
import { Prayer, ListResponse } from '../../../core/models/prayer.model';

@Component({
  selector: 'app-prayer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './prayer-list.component.html',
})
export class PrayerListComponent implements OnInit {
  items: Prayer[] = [];
  total = 0;
  error = '';

  constructor(private prayersService: PrayersService) {}

  async ngOnInit() {
    this.error = '';
    try {
      const resp: ListResponse<Prayer> = await this.prayersService.list(10, 0);
      this.items = resp.items ?? [];
      this.total = resp.total ?? this.items.length;
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Failed to load prayers';
    }
  }
}
