import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import {Profile} from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  private profile: Profile = { firstName: 'David', lastName: 'Tchintcharauli', email: 'Tchincharaulidavid@gmail.com', phone: '591161785', profilePicture: 'https://via.placeholder.com/150'}
  private userProfileSubject = new BehaviorSubject(this.profile)

  getProfile(): Observable<Profile> {
    return of(this.profile).pipe(delay(1000));
  }

  updateProfile(updatedProfile: Profile, profilePicture: File | null): Observable<Profile> {
    if(profilePicture) {
      const mockImageUrl = URL.createObjectURL(profilePicture)
      updatedProfile.profilePicture = mockImageUrl
    }

    this.profile = updatedProfile;
    this.userProfileSubject.next(this.profile);

    return of(this.profile).pipe(delay(1000));
  }
}
