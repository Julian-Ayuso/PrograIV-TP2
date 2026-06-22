import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth';
import { Modal } from '../../servicios/modal';
import { PublicacionService, Publicacion } from '../../servicios/publicaciones';
import { PublicacionCardComponent } from './publicacion-card/publicacion-card';

const POR_PAGINA = 5;

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [ReactiveFormsModule, PublicacionCardComponent],
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css'],
})
export class PublicacionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private modal = inject(Modal);
  private servicio = inject(PublicacionService);

  publicaciones = signal<Publicacion[]>([]);
  total = signal(0);
  orden = signal<'fecha' | 'likes'>('fecha');
  offset = signal(0);
  cargando = signal(false);
  publicando = signal(false);
  imagen: File | null = null;

  usuario = this.auth.usuarioActual;

  paginaActual = computed(() => this.offset() / POR_PAGINA + 1);
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.total() / POR_PAGINA)));
  hayAnterior = computed(() => this.offset() > 0);
  haySiguiente = computed(() => this.offset() + POR_PAGINA < this.total());

  formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.servicio
      .listar({ orden: this.orden(), offset: this.offset(), limit: POR_PAGINA })
      .subscribe({
        next: (resp) => {
          this.publicaciones.set(resp.publicaciones);
          this.total.set(resp.total);
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
          this.modal.mostrar({
            tipo: 'error',
            titulo: 'No pudimos cargar las publicaciones',
            mensaje: 'Verificá que el servidor esté funcionando e intentá de nuevo.',
          });
        },
      });
  }

  cambiarOrden(nuevo: 'fecha' | 'likes') {
    if (this.orden() === nuevo) return;
    this.orden.set(nuevo);
    this.offset.set(0);
    this.cargar();
  }

  paginaAnterior() {
    if (!this.hayAnterior()) return;
    this.offset.update((o) => Math.max(0, o - POR_PAGINA));
    this.cargar();
  }

  paginaSiguiente() {
    if (!this.haySiguiente()) return;
    this.offset.update((o) => o + POR_PAGINA);
    this.cargar();
  }

  seleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagen = input.files?.[0] ?? null;
  }

  publicar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const yo = this.usuario();
    if (!yo) return;

    this.publicando.set(true);
    const { titulo, descripcion } = this.formulario.getRawValue();
    const datos = new FormData();
    datos.append('titulo', titulo);
    datos.append('descripcion', descripcion);
    datos.append('autorId', yo._id);
    if (this.imagen) datos.append('imagen', this.imagen);

    this.servicio.crear(datos).subscribe({
      next: () => {
        this.publicando.set(false);
        this.formulario.reset();
        this.imagen = null;
        this.orden.set('fecha');
        this.offset.set(0);
        this.cargar();
      },
      error: () => {
        this.publicando.set(false);
        this.modal.mostrar({
          tipo: 'error',
          titulo: 'No pudimos publicar',
          mensaje: 'Revisá el título y el mensaje e intentá de nuevo.',
        });
      },
    });
  }

  alEliminar(id: string) {
    this.publicaciones.update((lista) => lista.filter((p) => p._id !== id));
    this.total.update((t) => Math.max(0, t - 1));
    this.modal.mostrar({
      tipo: 'exito',
      titulo: 'Publicación eliminada',
      mensaje: 'Ya no aparece en el listado.',
    });
  }
}
