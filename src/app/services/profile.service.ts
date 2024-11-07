import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import {Profile} from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  private Profile: Profile = { firstName: 'David', lastName: 'Tchintcharauli', email: 'Tchincharaulidavid@gmail.com', phone: '591161785', profilePicture: 'https://via.placeholder.com/150'}
  private userProfileSubject = new BehaviorSubject(this.Profile)

  getProfile(): Observable<Profile> {
    return of(this.Profile).pipe(delay(1000));
  }

  updateProfile(updatedProfile: Profile, profilePicture: File | null): Observable<Profile> {
    if(profilePicture) {
      const mockImageUrl = URL.createObjectURL(profilePicture)
      updatedProfile.profilePicture = mockImageUrl
    }

    this.Profile = updatedProfile;
    this.userProfileSubject.next(this.Profile);

    return of(this.Profile).pipe(delay(1000));
  }
}
