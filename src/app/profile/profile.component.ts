import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  firstName = ''
  lastName = ''
  email = ''
  phone = ''
  isLoader: boolean = true

  constructor(private router: Router, private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe(profile => {
      this.firstName = profile.firstName
      this.lastName = profile.lastName
      this.email = profile.email
      this.phone = profile.phone || ''
      this.isLoader = false
    })
  }

  navigateToEditProfile() {
      this.router.navigate(['/edit-profile'])
  }
}
