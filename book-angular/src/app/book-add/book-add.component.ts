import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import {Router, RouterLink} from '@angular/router';

interface Category {
  id: number;
  name: string;
}

interface Actor {
  id: number;
  name: string;
  surname: string;
}

@Component({
  selector: 'app-book-add',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    NgForOf,
    FormsModule
  ],
  templateUrl: './book-add.component.html',
  styleUrl: './book-add.component.css'
})
export class BookAddComponent {
  bookForm!: FormGroup;
  submitted: boolean = false;
  categories: Category[] = [];
  isLoadingCategories = false;
  isLoadingActors = false;
  actors: Actor[] = [];
  newActor = { name: '', surname: '' };
  showAddActor = false;
  selectedActors: Actor[] = [];


  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router) {
    this.bookForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(2)]),
      author: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      actors: new FormControl([], [Validators.required])
    });
  }
  ngOnInit(): void {
    this.loadCategories();
    this.loadActors();
    
    
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.isLoadingCategories = false;
      },
      error: (err) => {
        console.error('Błąd ładowania kategorii:', err);
        this.isLoadingCategories = false;
      }
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

  newCategory = { name: '' };
showAddCategory = false;

addNewCategory() {
  if (this.newCategory.name.trim()) {
    this.apiService.addCategory(this.newCategory).subscribe({
      next: (createdCategory) => {
        this.loadCategories();
        this.bookForm.get('category')?.setValue(createdCategory.id);
        this.newCategory = { name: '' };
        this.showAddCategory = false;
      },
      error: (err) => {
        console.error('Błąd dodawania kategorii:', err);
      }
    });
  }
}




  get actorsControl(): FormControl {
    return this.bookForm.get('actors') as FormControl;
  }

  get f() {
    return this.bookForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.bookForm.valid) {
      console.log(this.bookForm.value);
      console.log("Form is valid");

      const formValue = this.bookForm.value;
      const payload = {
        ...formValue,
        category: { id: Number(formValue.category) },
        actors: formValue.actors.map((actor: any) => ({ id: actor.id }))
      };

      console.log('Payload do wysłania:', payload);


      this.apiService.addBook(payload).subscribe({
        next: (res: any) => {
          this.router.navigateByUrl('/books');
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }



}

