import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: string | null;
  perfil: 'usuario' | 'administrador';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = "http://localhost:3000";

  // Usuario logueado, disponible para toda la app (lo lee MiPerfil)
  usuarioActual = signal<Usuario | null>(this.leerUsuarioGuardado());

  // El registro viaja como FormData porque incluye la imagen de perfil
  registrar(datos: FormData) {
    return this.http.post<Usuario>(`${this.api}/auth/registro`, datos);
  }

  login(usuario: string, contrasena: string) {
    return this.http.post<Usuario>(`${this.api}/auth/login`, {
      usuario,
      contrasena,
    });
  }

  guardarSesion(usuario: Usuario) {
    this.usuarioActual.set(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  cerrarSesion() {
    this.usuarioActual.set(null);
    localStorage.removeItem('usuario');
  }

  private leerUsuarioGuardado(): Usuario | null {
    const crudo = localStorage.getItem('usuario');
    return crudo ? JSON.parse(crudo) : null;
  }
}
