import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { ProfileComponent } from "../profile/profile.component"
import { NotificationService } from '../services/notification.service'
import { ToastComponent } from "../toast/toast.component"

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ProfileComponent, ToastComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  firstName = ''
  lastName = ''
  email = ''
  phone = ''
  initialFirstName = ''
  initialLastName = ''
  initialEmail = ''
  initialPhone = ''
  isLoader: boolean = false
  isFetchingData: boolean = true

  successMessage = ''
  errorMessage = ''

  selectedFile: File | null = null
  imagePreview: String | null = null
  imageName = ''
  imageSize: number = 0

  constructor(private profileService: ProfileService, private router: Router, private notificationService: NotificationService) { }

  ngOnInit() {
    this.profileService.getProfile().subscribe(profile => {
      this.firstName = profile.firstName
      this.lastName = profile.lastName
      this.email = profile.email
      this.phone = profile.phone || ''
      this.initialFirstName = profile.firstName
      this.initialLastName = profile.lastName
      this.initialEmail = profile.email
      this.initialPhone = profile.phone || ''

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
      this.notificationService.showToast('please select an image file.', 'error', 3000)
    }
  }

  removeImage(): void {
    this.selectedFile = null
    this.imagePreview = null
    this.imageName = ''
    this.imageSize = 0
  }

  saveProfile(): void {
    if (this.firstName !== this.initialFirstName || this.lastName !== this.initialLastName || this.email !== this.initialEmail || this.phone !== this.initialPhone || this.selectedFile) {
      this.isLoader = true;
      const updatedProfile = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone || null
      };
      this.profileService.updateProfile(updatedProfile, this.selectedFile).subscribe(
        response => {
          this.notificationService.showToast('Profile updated successfully!', 'success', 5000)
          this.router.navigate(['/profile'])
          this.isLoader = false
        },
        error => {
          this.notificationService.showToast('An error occurred while updating the profile. Please try again.', 'error', 5000)
          this.isLoader = false
        }
      );
    } else {
      this.notificationService.showToast('There are no changes to save. Please make changes or click on the Cancel button.', 'error', 5000)
    }
  }

  cancelEdit() {
    this.firstName = this.initialFirstName
    this.lastName = this.initialLastName
    this.email = this.initialEmail
    this.phone = this.initialPhone
    this.router.navigate(['/profile'])
  }

}
