import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Profile } from '../model/profile.model';
import { hasProfileChanges, populateForm } from './utils/profile-utils';
import { getImagePreview, isValidImage } from './utils/file-utils';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})

export class EditProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly profileService = inject(ProfileService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly notificationService = inject(NotificationService)
  private readonly destroyRef = inject(DestroyRef)

  profileForm!: FormGroup
  isLoader = false
  isFetchingData = true

  selectedFile: File | null = null
  imagePreview: String | null = null
  imageName = ''
  imageSize: number = 0

  currentProfilePicture: string | null = null
  initialProfileData: Profile | null = null

  private readonly MAX_IMAGE_SIZE_MB = 2
  private readonly MAX_IMAGE_SIZE_BYTES = this.MAX_IMAGE_SIZE_MB * 1024 * 1024

  ngOnInit(): void {
    this.initializeForm()
    this.fetchProfile()
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{9}$')]],
    })
  }

  private fetchProfile(): void {
    const id = this.getProfileId()
    this.profileService
      .getProfile(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          populateForm(this.profileForm, profile);
          this.currentProfilePicture = profile.profilePicture;
          this.initialProfileData = { ...profile };
          this.isFetchingData = false;
        },
        error: () => this.notificationService.showToast('Failed to load profile data.', 'error', 5000),
      });
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file && isValidImage(file, this.MAX_IMAGE_SIZE_BYTES)) {
      getImagePreview(file)
        .then((preview) => {
          this.imagePreview = preview as string
          this.selectedFile = file
          this.imageSize = Math.round(file.size / 1024)
        })
        .catch(() => {
          this.notificationService.showToast('Error previewing the file.', 'error', 5000)
        })
    } else {
      this.notificationService.showToast(`Invalid file. Please upload an image of size less than ${this.MAX_IMAGE_SIZE_MB} MB.`, 'error', 5000)
    }
  }

  removeImage(): void {
    this.selectedFile = null
    this.imagePreview = null
    this.imageName = ''
    this.imageSize = 0
  }

  saveProfile(): void {
    if (!this.profileForm.valid || !this.hasChanges()) {
      this.notificationService.showToast('No changes detected. Please make changes to save.', 'error', 5000)
      return
    }

    this.isLoader = true
    const id = this.getProfileId();
    const updatedProfile = {
      ...this.profileForm.value,
      id,
      profilePicture: this.selectedFile || this.currentProfilePicture,
    }

    this.profileService
      .updateProfile(updatedProfile, this.selectedFile)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showToast('Profile updated successfully!', 'success', 1000)
          this.router.navigate(['/profile', id])
        },
        error: () => this.notificationService.showToast('An error occurred while updating the profile. Please try again.', 'error', 5000)
      })
      .add(() => (this.isLoader = false))
  }

  cancelEdit() {
    this.router.navigate(['/profile'])
  }

  private getProfileId(): number {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (isNaN(id)) {
      this.notificationService.showToast('Invalid profile ID.', 'error', 5000);
      this.router.navigate(['/']);
      return 0;
    }
    return id;
  }

  private hasChanges(): boolean {
    const hasFileChange = this.selectedFile !== null;
    return hasProfileChanges(
      this.profileForm.value,
      this.initialProfileData,
      hasFileChange
    );
  }
}
