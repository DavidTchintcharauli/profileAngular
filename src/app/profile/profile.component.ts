import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../model/profile.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile$!: Observable<Profile>

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private profileService = inject(ProfileService)

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.userProfile$ = this.profileService.getProfile(id)
  }

  navigateToEditProfile() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.router.navigate(['/edit-profile', id])
  }
}
