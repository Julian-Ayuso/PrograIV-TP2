import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./paginas/publi/publi').then(m => m.Publi),
        pathMatch: 'full'
    },
    {
        path: 'publi',
        loadComponent: () => import('./paginas/publi/publi').then(m => m.Publi),
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
        loadComponent: () => import('./paginas/miperfil/miperfil').then(m => m.Miperfil)
    },
    {
        path: '**',
        loadComponent: () => import('./paginas/publi/publi').then(m => m.Publi)
    }
];