import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'edit-profile',
        component: EditProfileComponent
    },
    {
        path: '**',
        redirectTo: 'profile'
    }
];
