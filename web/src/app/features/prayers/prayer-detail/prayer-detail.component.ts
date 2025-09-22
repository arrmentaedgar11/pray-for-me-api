import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-prayer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './prayer-detail.component.html',
  styleUrls: ['./prayer-detail.component.scss'],
})
export class PrayerDetailComponent implements OnInit {
  id = 0;


  prayer = {
    id: 0,
    title: '',
    description: 'Details go here...',
    prayed_count: 0,
    status: 'open',
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id') ?? 0);
    this.prayer = {
      id: this.id,
      title: `Prayer #${this.id}`,
      description: 'Details go here...',
      prayed_count: 0,
      status: 'open',
    };
  }

  pray() {
  
    this.prayer.prayed_count++;
  }
}
