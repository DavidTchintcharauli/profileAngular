import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  private fb = inject(FormBuilder)
  private profileService = inject(ProfileService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private notificationService = inject(NotificationService)
  private destroyRef = inject(DestroyRef)

  profileForm: any = FormGroup
  isLoader = false
  isFetchingData = true

  successMessage = ''
  errorMessage = ''

  selectedFile: File | null = null
  imagePreview: String | null = null
  imageName = ''
  imageSize: number = 0

  currentProfilePicture: string | null = null

  initialProfileData: any

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.profileService.getProfile(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (profile) => {
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone || '',
        })
        this.currentProfilePicture = profile.profilePicture
        this.initialProfileData = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone || '',
          profilePicture: profile.profilePicture
        }
        this.isFetchingData = false
      },
      (error) => {
        this.errorMessage = 'Failed to load profile data. Please try again.'
        this.isFetchingData = false
      }
    )

    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{9}$')]],
      profilePicture: [null],
    })
  }

  onFileChange(event: any): void {
    const file = event.target.files[0] as File
    if (file) {
      this.uploadFile(file)
    }
  }

  uploadFile(file: File): void {
    if (file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string
      }
      reader.readAsDataURL(file)

      this.imageName = file.name
      this.imageSize = Math.round(file.size / 1024)
      this.selectedFile = file
    } else {
      this.notificationService.showToast('please select an image file.', 'error', 5000)
    }
  }

  removeImage(): void {
    this.selectedFile = null
    this.imagePreview = null
    this.imageName = ''
    this.imageSize = 0
  }

  hasChanges() {
    return (
      this.profileForm.value.firstName !== this.initialProfileData.firstName ||
      this.profileForm.value.lastName !== this.initialProfileData.lastName ||
      this.profileForm.value.email !== this.initialProfileData.email ||
      this.profileForm.value.phone !== this.initialProfileData.phone ||
      (this.selectedFile && this.selectedFile.name !== this.initialProfileData.profilePicture)
    )
  }

  saveProfile(): void {
    if (this.hasChanges()) {
      if (this.profileForm.valid) {
        this.isLoader = true
        const id = Number(this.route.snapshot.paramMap.get('id'))
        const updatedProfile = { ...this.profileForm.value, id }

        if (!this.selectedFile) {
          updatedProfile.profilePicture = this.currentProfilePicture
        } else {
          updatedProfile.profilePicture = this.selectedFile
        }

        this.profileService.updateProfile(updatedProfile, this.selectedFile).subscribe(
          response => {
            this.notificationService.showToast('Profile updated successfully!', 'success', 5000)
            this.router.navigate(['/profile', id])
            this.isLoader = false
          },
          error => {
            this.notificationService.showToast('An error occurred while updating the profile. Please try again.', 'error', 5000)
            this.isLoader = false
          }
        )
      }
    } else {
      this.notificationService.showToast('There are no changes. Please make some changes to save or click on cancel.', 'error', 5000)
    }
  }

  cancelEdit() {
    this.router.navigate(['/profile'])
  }

}
