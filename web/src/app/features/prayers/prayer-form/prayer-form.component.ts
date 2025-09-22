// web/src/app/features/prayers/prayer-form/prayer-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';       
import { PrayersService } from '../../../services/prayer.service';

@Component({
  selector: 'app-prayer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],              // <-- INCLUDE FormsModule
  template: `
    <section class="page">
      <h1>Create Prayer</h1>

      <label>
        Title
        <input type="text" [(ngModel)]="title" maxlength="120" />
      </label>
      <p>Max 120 characters.</p>

      <label>
        <input type="checkbox" [(ngModel)]="isPrivate" />
        Private prayer?
      </label>

      <p *ngIf="error" style="color:#b00">{{ error }}</p>

      <button (click)="create()">Create</button>
    </section>
  `,
})
export class PrayerFormComponent {
  title = '';
  isPrivate = false;
  error = '';

  constructor(private prayers: PrayersService) {}

  async create() {
    this.error = '';
    try {
      if (!this.title.trim()) {
        this.error = 'Title is required';
        return;
      }
      await this.prayers.create({
        title: this.title.trim(),
        is_private: this.isPrivate,
        categories: [], // can wire categories later
      });
      window.location.href = '/prayers';
    } catch (e: unknown) {
      this.error =
        e instanceof Error ? `Failed to create prayer: ${e.message}` : 'Failed to create prayer';
    }
  }
}
