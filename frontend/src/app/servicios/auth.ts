import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// IMPORTANTE: estos nombres deben coincidir con lo que devuelve TU back.
// Según tus archivos, el usuario tiene: nick, fecha, perfil, imagenPerfil.
// Si alguno se llama distinto en tu schema, ajustalo acá (y en los templates).
export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nick: string;
  fecha: string;
  descripcion: string;
  imagenPerfil: string | null;
  perfil: 'usuario' | 'administrador';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private plataformaId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private api = "http://localhost:3000";

  usuarioActual = signal<Usuario | null>(this.leerUsuarioGuardado());

  registrar(datos: FormData) {
    return this.http.post<Usuario>(`${this.api}/auth/registro`, datos);
  }

  // El body debe coincidir con tu LoginDto. En tus archivos el campo de
  // contraseña se llama "pass", así que mandamos { usuario, pass }.
  login(usuario: string, pass: string) {
    return this.http.post<Usuario>(`${this.api}/auth/login`, { usuario, pass });
  }

  guardarSesion(usuario: Usuario) {
    this.usuarioActual.set(usuario);
      if (isPlatformBrowser(this.plataformaId)) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }
  }

  cerrarSesion() {
    this.usuarioActual.set(null);
      if (isPlatformBrowser(this.plataformaId)) {
        localStorage.removeItem('usuario');
      }
  }

  private leerUsuarioGuardado(): Usuario | null {
    if (!isPlatformBrowser(this.plataformaId)) return null;
    const crudo = localStorage.getItem('usuario');
    return crudo ? JSON.parse(crudo) : null;
  }
}
