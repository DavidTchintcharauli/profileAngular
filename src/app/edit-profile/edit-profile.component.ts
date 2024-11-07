import {Component, OnInit, NgModule, inject, DestroyRef} from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, ReactiveFormsModule, MinLengthValidator} from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { ProfileComponent } from "../profile/profile.component"
import { NotificationService } from '../services/notification.service'
import { ToastComponent } from "../toast/toast.component"
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, ProfileComponent, ToastComponent, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  profileForm: any = FormGroup;
  isLoader: boolean = false
  isFetchingData: boolean = true

  successMessage = ''
  errorMessage = ''

  selectedFile: File | null = null
  imagePreview: String | null = null
  imageName = ''
  imageSize: number = 0

  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, ]],
      phone: ['', [Validators.pattern('^[0-9]{9}$')]],
      profilePicture: [null]
    });
    this.profileService.getProfile().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(profile => {
      this.profileForm.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || ''
      });
      this.isFetchingData = false
    },
    (error) => {
      this.errorMessage = 'Failed to load profile data. Please try again.';
      this.isFetchingData = false;
    }
  );
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

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoader = true;
      const updatedProfile = this.profileForm.value;

      if (this.selectedFile) {
        updatedProfile.profilePicture = this.selectedFile;
      }

      this.profileService.updateProfile(updatedProfile, this.selectedFile).subscribe(
        response => {
          this.notificationService.showToast('Profile updated successfully!', 'success', 5000);
          this.router.navigate(['/profile']);
          this.isLoader = false;
        },
        error => {
          this.notificationService.showToast('An error occurred while updating the profile. Please try again.', 'error', 5000);
          this.isLoader = false;
        }
      );
    } else {
      this.notificationService.showToast('Please fix the errors in the form before saving.', 'error', 5000);
    }
  }

  cancelEdit() {
    this.router.navigate(['/profile'])
  }

}
