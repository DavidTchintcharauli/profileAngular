import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'profile/1',
        pathMatch: 'full'
    },
    {
        path: 'profile/:id',
        component: ProfileComponent
    },
    {
        path: 'edit-profile/:id',
        component: EditProfileComponent
    },
    {
        path: '**',
        redirectTo: 'profile/1'
    }
]
