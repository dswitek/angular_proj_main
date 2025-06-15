import {Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ApiService} from '../api.service';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import {Actor} from '../book';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    FormsModule,
    NgIf,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  books: any[] = [];
  isLoadingActors = false;
  actors: Actor[] = [];
  newActor = { name: '', surname: '' };
  showAddActor = false;
  bookForm!: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(2)]),
      author: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      actors: new FormControl([], [Validators.required])
    });
  }

  ngOnInit() {
    this.apiService.getBooks().subscribe((data: any[]) => {
      this.books = data;
      console.log("Films loaded:", this.books);
      this.loadActors();
    });
  }

  loadActors() {
    this.apiService.getActors().subscribe({
      next: (data: Actor[]) => {
        this.actors = data;
        this.isLoadingActors = false;
      },
      error: (err) => {
        console.error('Błąd ładowania aktorów:', err);
        this.isLoadingActors = false;
      }
    });
  }

  addNewActor() {
    if (this.newActor.name && this.newActor.surname) {
      this.apiService.addActor(this.newActor).subscribe({
        next: (createdActor) => {
          this.loadActors();
          const current = this.bookForm.get('actors')?.value || [];
          this.bookForm.get('actors')?.setValue([...current, createdActor]);
          this.newActor = { name: '', surname: '' };
          this.showAddActor = false;
        },
        error: (err) => {
          console.error('Błąd podczas dodawania aktora:', err);
        }
      });
    }
  }

  showAddCategory = false;
newCategoryName: string = '';

addNewCategory() {
  const name = this.newCategoryName.trim();
  if (!name) return;

  this.apiService.addCategory({ name }).subscribe({
    next: (createdCategory) => {
      console.log('Dodano kategorię:', createdCategory);
      this.newCategoryName = '';
      this.showAddCategory = false;
      // Można też odświeżyć listę książek, jeśli potrzeba
    },
    error: (err) => {
      console.error('Błąd podczas dodawania kategorii:', err);
    }
  });
}



  get actorsControl(): FormControl {
    return this.bookForm.get('actors') as FormControl;
  }

  deleteBook(id: number) {
    const confirmed = window.confirm(`Are you sure you want to delete ?`);
    if (confirmed) {
      this.apiService.deleteBook(id).subscribe({
        next: (res) => {
          this.books = this.books.filter(book => book.id !== id);
        }
      });

    }
  }
}
