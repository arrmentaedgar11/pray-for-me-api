// web/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'prayers', pathMatch: 'full' },
  {
    path: 'prayers',
    loadComponent: () =>
      import('./features/prayers/prayer-list/prayer-list.component')
        .then(m => m.PrayerListComponent),
  },
  {
    path: 'prayers/new',
    loadComponent: () =>
      import('./features/prayers/prayer-form/prayer-form.component')
        .then(m => m.PrayerFormComponent),
  },
  {
    path: 'prayers/:id',
    loadComponent: () =>
      import('./features/prayers/prayer-detail/prayer-detail.component')
        .then(m => m.PrayerDetailComponent),
  },
  {
    path: 'prayers/:id/comments',
    loadComponent: () =>
      import('./features/comments/comment-list/comment-list.component')
        .then(m => m.CommentListComponent),
  },
  { path: '**', redirectTo: 'prayers' },
];
