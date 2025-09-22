import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  prayerId = 0;

  // dummy items; replace with GET /api/prayers/:id/comments?limit=&offset=
  items = [
    { id: 1, display_name: 'Armen', content: 'Praying for you 🙏', likes_count: 0 },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.prayerId = Number(this.route.snapshot.paramMap.get('id') ?? 0);
  }

  like(c: any) {

    c.likes_count++;
  }

  remove(c: any) {
    this.items = this.items.filter(i => i.id !== c.id);
  }
}
