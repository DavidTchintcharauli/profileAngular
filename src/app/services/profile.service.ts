import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
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

  private userProfileSubject = new BehaviorSubject<Profile[]>([...this.profiles])
  profiles$ = this.userProfileSubject.asObservable()

  getProfile(id: number): Observable<Profile> {
    return of(this.profiles.find(p => p.id === id)).pipe(
      delay(500),
      map(profile => {
        if (!profile) {
          throw throwError(() => new Error(`profile with ID ${id} not found`))
        }
        return profile
      })
    )
  }

  updateProfile(updatedProfile: Profile, profilePicture: File | null): Observable<Profile> {
    const index = this.profiles.findIndex(p => p.id === updatedProfile.id)

    if (index === -1) {
      return throwError(() => new Error(`Profile with ID ${updatedProfile.id} not found`))
    }

    const updatedPicture = profilePicture ? this.generateMockImageUrl(profilePicture) : updatedProfile.profilePicture || 'https://via.placeholder.com/150'

    const updated = { ...updatedProfile, profilePicture: updatedPicture }
    this.profiles[index] = updated
    this.userProfileSubject.next([...this.profiles])

    return of(updated).pipe(delay(500))
  }

  private generateMockImageUrl(file: File): string {
    return URL.createObjectURL(file)
  }
}