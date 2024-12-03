import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../model/profile.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile$!: Observable<Profile>
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly profileService = inject(ProfileService)
  private readonly notificationService = inject(NotificationService)
  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    const id = this.getProfileId()
    this.userProfile$ = this.profileService.getProfile(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    )
  }

  navigateToEditProfile() {
    const id = this.getProfileId();
    this.router.navigate(['/edit-profile', id])
  }

  private getProfileId(): number{
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.notificationService.showToast('Invalid profile ID.', 'error', 5000);
      this.router.navigate(['/']);
      return 0;
    }
    return id;
  }
}
