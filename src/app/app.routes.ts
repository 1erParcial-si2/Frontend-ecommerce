import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./app.component')
    },
    {
        path: 'login',
        loadComponent: () => import('./views/login/login.component')
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
