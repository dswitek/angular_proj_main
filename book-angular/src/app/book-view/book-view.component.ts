import {Component, OnInit} from '@angular/core';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {Book} from '../book';
import {ApiService} from '../api.service';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-book-view',
  imports: [
    NgIf,
    RouterLink,
    NgForOf,
  ],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.css'
})
export class BookViewComponent implements OnInit {
  book!: Book;
  bookId!: number;
  categoryName: string = '';

  constructor(private apiService: ApiService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.bookId = this.activatedRoute.snapshot.params['id'];
    console.log(this.bookId);

    this.apiService.getBook(this.bookId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.book = data;
      }
    });
  }

}
