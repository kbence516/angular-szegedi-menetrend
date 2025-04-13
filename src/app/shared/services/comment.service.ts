import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable, first } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

   collectionName = 'comments';
 
   fetchAll(): Observable<Comment[]> {
     return (collectionData(collection(environment.db, this.collectionName)) as Observable<Comment[]>).pipe(first());
   }
 }