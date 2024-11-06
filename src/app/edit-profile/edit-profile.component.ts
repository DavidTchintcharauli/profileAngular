import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { ProfileComponent } from "../profile/profile.component"
import { ReactiveFormsModule, Validators } from '@angular/forms';
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
    });
  }

  saveProfile() {
    if (this.firstName !== this.initialFirstName || this.lastName !== this.initialLastName || this.email !== this.initialEmail || this.phone !== this.initialPhone) {
      this.isLoader = true;
      const updatedProfile = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone || null
      };
      this.profileService.updateProfile(updatedProfile).subscribe(
        response => {
          this.notificationService.showToast('Profile updated successfully!', 'success', 5000)
          this.router.navigate(['/profile'])
          this.isLoader = false
        },
        error => {
          this.notificationService.showToast('An error occurred while updating the profile. Please try again.', 'error')
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
