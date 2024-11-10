import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import { Profile } from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  private profiles: Profile[] = [
    {
      id: 1,
      firstName: 'David',
      lastName: 'Tchintcharauli',
      email: 'Tchincharaulidavid@gmail.com',
      phone: '591161785',
      profilePicture: 'https://via.placeholder.com/150'
    }
  ]

  private userProfileSubject = new BehaviorSubject(this.profiles)

  getProfile(id: number): Observable<Profile> {
    const profile = this.profiles.find(p => p.id === id)
    if (profile) {
      return of(profile).pipe(delay(1000))
    } else {
      return of(null as any).pipe(delay(1000))
    }
  }

  updateProfile(updatedProfile: Profile, profilePicture: File | null): Observable<Profile> {
    const index = this.profiles.findIndex(p => p.id === updatedProfile.id)

    if (index !== -1) {
      if (profilePicture) {
        const mockImageUrl = URL.createObjectURL(profilePicture)
        updatedProfile.profilePicture = mockImageUrl
      } else {
        updatedProfile.profilePicture = updatedProfile.profilePicture || 'https://via.placeholder.com/150'
      }

      this.profiles[index] = updatedProfile
      this.userProfileSubject.next(this.profiles)

      return of(updatedProfile).pipe(delay(1000))
    } else {
      return of(null as any)
    }
  }}