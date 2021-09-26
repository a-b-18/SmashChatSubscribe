import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Document } from '../_models/document';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  baseUrl = 'https://localhost:5001/api/';
  private currentUserSource = new ReplaySubject<Document>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  upload(model: any) {
    return this.http.post(this.baseUrl + 'document/upload', model).pipe(
      map((doc: Document) => {
        if (doc) {
          localStorage.setItem('doc', JSON.stringify(doc));
          this.currentUserSource.next(doc);
        }
      })
    )
  }

}
