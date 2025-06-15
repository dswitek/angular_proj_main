import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { Book } from '../book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule]
})
export class BookEditComponent implements OnInit {
  bookForm!: FormGroup;
  bookId!: number;
  submitted = false;
  categories: any[] = [];
  actors: any[] = [];

  constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private route: ActivatedRoute,
      private router: Router,
  ) {}

  ngOnInit(): void {
    this.bookId = +this.route.snapshot.params['id'];

    this.bookForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(2)]),
      author: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      actors: new FormControl([])
    });

    this.apiService.getBook(this.bookId).subscribe({
      next: (book) => {
        this.bookForm.patchValue(book);
      },
      error: (err) => {
        console.error('Błąd ładowania filmu:', err);
      }
    });

    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Błąd ładowania kategorii:', err);
      }
    });

    this.apiService.getActors().subscribe({
      next: (data) => {
        this.actors = data;
      },
      error: (err) => {
        console.error('Błąd ładowania aktorów:', err);
      }
    });

  }

  onSubmit() {
    this.submitted = true;

    if (this.bookForm.invalid) {
      return;
    }

    const updatedBook: Book = {
      id: this.bookId,
      ...this.bookForm.value
    };

    this.apiService.updateBook(updatedBook).subscribe({
      next: () => {
        this.router.navigateByUrl('/books');
      },
      error: (err: any) => {
        console.error('Błąd aktualizowania filmu:', err);
      }
    });
  }
}
