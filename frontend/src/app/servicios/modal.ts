import { Injectable, signal } from '@angular/core';

export interface DatosModal {
  tipo: 'exito' | 'error' | 'info';
  titulo: string;
  mensaje: string;
}

// Reemplazo de alert(): cualquier componente llama a
// modal.mostrar({...}) y el ModalComponent global lo dibuja.
@Injectable({ providedIn: 'root' })
export class Modal {
  modal = signal<DatosModal | null>(null);

  mostrar(datos: DatosModal) {
    this.modal.set(datos);
  }

  cerrar() {
    this.modal.set(null);
  }
}