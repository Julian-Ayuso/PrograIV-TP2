import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../servicios/auth';
import { Modal } from '../../../servicios/modal';
import { PublicacionService, Publicacion } from '../../../servicios/publicaciones';

// "Cada publicación debe ser un componente" -> este es ese componente.
@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './publicacion-card.html',
  styleUrls: ['./publicacion-card.css'],
})
export class PublicacionCardComponent {
  @Input({ required: true }) set publicacion(valor: Publicacion) {
    this.pub.set(valor);
    this.cantidad.set(valor.cantidadMeGusta);
    const yo = this.auth.usuarioActual()?._id;
    this.leDiMeGusta.set(!!yo && valor.meGusta.includes(yo));
  }

  // Avisamos al padre cuando se eliminó, para que la saque del listado
  @Output() eliminada = new EventEmitter<string>();

  private auth = inject(AuthService);
  private modal = inject(Modal);
  private servicio = inject(PublicacionService);

  pub = signal<Publicacion | null>(null);
  cantidad = signal(0);
  leDiMeGusta = signal(false);
  procesando = signal(false);

  // ¿Puedo borrar esta publicación? Solo si soy el autor o administrador.
  puedoEliminar = computed(() => {
    const u = this.auth.usuarioActual();
    const p = this.pub();
    if (!u || !p) return false;
    // 'perfil' es el campo de rol del usuario. Ajustá si lo llamaste distinto."http://localhost:3000"
    return u._id === p.autor._id || u.perfil === 'administrador';
  });

  urlImagen = computed(() => {
    const img = this.pub()?.imagen;
    return img ?? null; 
  });

  urlAvatar = computed(() => {
    const img = this.pub()?.autor?.imagenPerfil;
    return img ?? null;
  });

  alternarMeGusta() {
    const yo = this.auth.usuarioActual();
    const p = this.pub();
    if (!yo) {
      this.modal.mostrar({
        tipo: 'info',
        titulo: 'Ingresá primero',
        mensaje: 'Necesitás iniciar sesión para reaccionar a una publicación.',
      });
      return;
    }
    if (!p || this.procesando()) return;
    this.procesando.set(true);

    const accion = this.leDiMeGusta()
      ? this.servicio.quitarMeGusta(p._id, yo._id)
      : this.servicio.darMeGusta(p._id, yo._id);

    accion.subscribe({
      next: (resp) => {
        this.cantidad.set(resp.cantidadMeGusta);
        this.leDiMeGusta.update((v) => !v);
        this.procesando.set(false);
      },
      error: () => {
        this.procesando.set(false);
        this.modal.mostrar({
          tipo: 'error',
          titulo: 'No pudimos registrar tu reacción',
          mensaje: 'Intentá de nuevo en un momento.',
        });
      },
    });
  }

  pedirEliminar() {
    const p = this.pub();
    if (!p) return;
    this.modal.confirmar(
      'Eliminar publicación',
      '¿Seguro que querés eliminar esta publicación? No vas a poder verla más.',
      () => this.eliminar(),
      'Eliminar',
    );
  }

  private eliminar() {
    const yo = this.auth.usuarioActual();
    const p = this.pub();
    if (!yo || !p) return;

    this.servicio.eliminar(p._id, yo._id).subscribe({
      next: () => this.eliminada.emit(p._id),
      error: () =>
        this.modal.mostrar({
          tipo: 'error',
          titulo: 'No pudimos eliminarla',
          mensaje: 'Revisá tu conexión e intentá otra vez.',
        }),
    });
  }
}
