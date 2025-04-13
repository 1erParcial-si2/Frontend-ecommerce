import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'usuarios',
                loadComponent: () => import('./views/usuarios/usuarios.component')
            },
            {
                path: 'autores',
                loadComponent: () => import('./views/autores/autores.component')
            },
            {
                path: 'generos',
                loadComponent: () => import('./views/generos/generos.component')
            },
            {
                path: 'editoriales',
                loadComponent: () => import('./views/editoriales/editoriales.component')
            },
            {
                path: '',
                redirectTo: 'usuarios',
                pathMatch: 'full'
            }
        ]
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
