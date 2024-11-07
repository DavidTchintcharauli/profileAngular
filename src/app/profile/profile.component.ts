import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../model/profile.model';
import { Observable } from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userProfile$!: Observable<Profile>;

  private router = inject(Router)
  private profileService = inject(ProfileService)

  ngOnInit() {
    this.userProfile$ = this.profileService.getProfile();
  }

  navigateToEditProfile() {
      this.router.navigate(['/edit-profile'])
  }
}
