import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { ProfileComponent } from "../profile/profile.component";
import { ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ProfileComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit{

  // profileForm = new FormGroup({
  //   firstName: new FormGroup('', Validators.required),
  //   lastName: new FormGroup('', Validators.required)
  // })

  firstName = ''
  lastName = '';
  initialFirstName = '';
  initialLastName = '';
  isLoader: boolean = false;
  isFetchingData: boolean = true;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe(profile => {
      this.firstName = profile.firstName;
      this.lastName = profile.lastName;
      this.initialFirstName = profile.firstName;
      this.initialLastName = profile.lastName;

      this.isFetchingData = false;
    });
  }

  saveProfile() {
    if (this.firstName !== this.initialFirstName || this.lastName !== this.initialLastName ) {
      this.isLoader = true;
      const updatedProfile = {
        firstName: this.firstName,
        lastName: this.lastName
      };
      this.profileService.updateProfile(updatedProfile).subscribe(
        response => {
          console.log('Profile updated successfully:', response);
          this.router.navigate(['/profile']);
          this.isLoader = false;
        },
        error => {
          console.error('Error updating profile:', error);
          this.isLoader = false;
        }
      );
    } else {
      console.log('No changes detected.');
    }
  }

  cancelEdit() {
    this.firstName = this.initialFirstName;
    this.lastName = this.initialLastName;
    this.router.navigate(['/profile']);
  }

}
