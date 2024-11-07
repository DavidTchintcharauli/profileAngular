import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  private userProfile = { firstName: 'David', lastName: 'Tchintcharauli', email: 'Tchincharaulidavid@gmail.com', phone: 591161785, profilePicture: 'https://via.placeholder.com/150'}
  private userProfileSubject = new BehaviorSubject(this.userProfile)

  constructor() { }

  getProfile(): Observable<any> {
    return of(this.userProfile).pipe(delay(1000));
  }

  updateProfile(updatedProfile: any, profilePicture: File | null): Observable<any> {

    if(profilePicture) {
      const mockImageUrl = URL.createObjectURL(profilePicture)
      updatedProfile.profilePicture = mockImageUrl
    }

    this.userProfile = updatedProfile;
    this.userProfileSubject.next(this.userProfile);
    
    return of(this.userProfile).pipe(delay(1000));
  }
}
