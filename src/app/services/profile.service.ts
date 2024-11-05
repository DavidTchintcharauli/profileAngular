import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private userProfile = { firstName: 'David', lastName: 'Tchintcharauli'}
  private userProfileSubject = new BehaviorSubject(this.userProfile)

  constructor() { }

  getProfile(): Observable<any> {
    return of(this.userProfile).pipe(delay(1000));
  }

  updateProfile(updatedProfile: any): Observable<any> {
    this.userProfile = updatedProfile;
    this.userProfileSubject.next(this.userProfile);
    return of(this.userProfile).pipe(delay(1000));
  }
}
