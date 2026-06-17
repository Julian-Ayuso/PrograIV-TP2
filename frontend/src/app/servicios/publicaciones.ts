import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Datos del autor que el back devuelve poblados.
// OJO: estos nombres deben coincidir con lo que tu back hace en el populate
// ('nombre apellido nick imagenPerfil'). Si los renombraste, ajustá acá.
export interface AutorResumen {
  _id: string;
  nombre: string;
  apellido: string;
  nick: string;
  imagenPerfil: string | null;
}

export interface Publicacion {
  _id: string;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  autor: AutorResumen;
  meGusta: string[];
  cantidadMeGusta: number;
  createdAt: string;
}

export interface RespuestaListado {
  total: number;
  publicaciones: Publicacion[];
}

export interface OpcionesListado {
  orden?: 'fecha' | 'likes';
  autor?: string;
  offset?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class PublicacionService {
  private http = inject(HttpClient);
  private api = `https://prograiv-tp2-l2dv.onrender.com/publicaciones`;

  listar(opciones: OpcionesListado = {}): Observable<RespuestaListado> {
    let params = new HttpParams();
    if (opciones.orden) params = params.set('orden', opciones.orden);
    if (opciones.autor) params = params.set('autor', opciones.autor);
    if (opciones.offset != null) params = params.set('offset', opciones.offset);
    if (opciones.limit != null) params = params.set('limit', opciones.limit);
    return this.http.get<RespuestaListado>(this.api, { params });
  }

  // FormData porque incluye la imagen opcional (multipart/form-data)
  crear(datos: FormData): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.api, datos);
  }

  // DELETE con body: HttpClient lo permite pasando { body } en las opciones.
  // (En Sprint 3, usuarioId saldrá del token y no del body.)
  eliminar(id: string, usuarioId: string) {
    return this.http.delete(`${this.api}/${id}`, { body: { usuarioId } });
  }

  darMeGusta(id: string, usuarioId: string) {
    return this.http.post<{ cantidadMeGusta: number }>(
      `${this.api}/${id}/me-gusta`,
      { usuarioId },
    );
  }

  quitarMeGusta(id: string, usuarioId: string) {
    return this.http.delete<{ cantidadMeGusta: number }>(
      `${this.api}/${id}/me-gusta`,
      { body: { usuarioId } },
    );
  }
}
