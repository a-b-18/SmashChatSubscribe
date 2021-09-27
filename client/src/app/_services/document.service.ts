import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Document } from '../_models/document';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  baseUrl = 'https://192.168.1.102:5001/api/';
  private currentUserSource = new ReplaySubject<Document>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  upload(model: any) {
    return this.http.post(this.baseUrl + 'document/upload', model).pipe(
      map((doc: Document) => {
        if (doc) {
          // Handle upload response
        }
      })
    )
  }

  list(user: any) {
    return this.http.get(this.baseUrl + 'document/list' + user).pipe(

    )
  }

  view(model: any) {
    return this.http.post(this.baseUrl + 'document/read', model).pipe(
      map((doc: Document) => {
        if (doc) {
          return doc;
        }
      })
    )
  }

}
