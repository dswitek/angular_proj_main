import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from './book';

@Injectable({
  providedIn: 'root'
})
export class ApiService {



  // private url = 'https://jsonplaceholder.typicode.com/posts';
  private url = 'http://localhost:8081/api/books';

  constructor(private httpClient: HttpClient) { }

  getBooks():Observable<any> {
    return this.httpClient.get(this.url);
  }

  getBook(id: number) {
    return this.httpClient.get(`${this.url}/${id}`);
  }
  addBook(book: Book): Observable<any> {
    return this.httpClient.post(this.url, book);
  }
  deleteBook(id: number) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
  showBook(id: number): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }
  updateBook(book: Book): Observable<any> {
    return this.httpClient.put(`${this.url}/${book.id}`, book);
  }

  getCategories(): Observable<any> {
    return this.httpClient.get(`${this.url}/categories`, {});
  }

  getActors(): Observable<any> {
    return this.httpClient.get(`${this.url}/actors`, {});
  }

  addActor(actor: any): Observable<any> {
    return this.httpClient.post(`${this.url}/actors`, actor);
  }

  addCategory(category: { name: string }): Observable<any> {
  return this.httpClient.post(`${this.url}/categories`, category);
}

}

