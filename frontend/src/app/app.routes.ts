import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./paginas/publicaciones/publicaciones').then(m => m.PublicacionesComponent),
        pathMatch: 'full'
    },
    {
        path: 'publi',
        loadComponent: () => import('./paginas/publicaciones/publicaciones').then(m => m.PublicacionesComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./paginas/login/login').then(m => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./paginas/registro/registro').then(m => m.Registro)
    },
    {
        path: 'miperfil',
        loadComponent: () => import('./paginas/miperfil/miperfil').then(m => m.MiPerfil)
    },
    {
        path: '**',
        loadComponent: () => import('./paginas/publicaciones/publicaciones').then(m => m.PublicacionesComponent),
    }
];