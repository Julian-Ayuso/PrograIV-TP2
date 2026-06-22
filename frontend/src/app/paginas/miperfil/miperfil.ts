import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth';
import { PublicacionService, Publicacion } from '../../servicios/publicaciones';
import { PublicacionCardComponent } from '../publicaciones/publicacion-card/publicacion-card';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [DatePipe, RouterLink, PublicacionCardComponent],
  templateUrl: './miperfil.html',
  styleUrls: ['./miperfil.css'],
})
export class MiPerfil implements OnInit {
  private auth = inject(AuthService);
  private servicio = inject(PublicacionService);

  usuario = this.auth.usuarioActual;
  misPublicaciones = signal<Publicacion[]>([]);
  cargando = signal(false);

  urlImagen = computed(() => {
    const u = this.usuario();
    return u?.imagenPerfil ?? null;
  });

  ngOnInit() {
    const u = this.usuario();
    if (!u) return;
    this.cargando.set(true);
    this.servicio.listar({ autor: u._id, limit: 3, orden: 'fecha' }).subscribe({
      next: (resp) => {
        this.misPublicaciones.set(resp.publicaciones);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  alEliminar(id: string) {
    this.misPublicaciones.update((lista) => lista.filter((p) => p._id !== id));
  }
}
