import { Injectable, signal } from '@angular/core';

export interface DatosModal {
  tipo: 'exito' | 'error' | 'info' | 'confirmar';
  titulo: string;
  mensaje: string;
  // Solo para tipo 'confirmar':
  textoConfirmar?: string;
  alConfirmar?: () => void;
}

// Reemplazo de alert()/confirm(): cualquier componente llama a
// modal.mostrar({...}) y el ModalComponent global lo dibuja.
@Injectable({ providedIn: 'root' })
export class Modal {
  modal = signal<DatosModal | null>(null);

  mostrar(datos: DatosModal) {
    this.modal.set(datos);
  }

  // Atajo para pedir confirmación antes de una acción destructiva
  confirmar(
    titulo: string,
    mensaje: string,
    alConfirmar: () => void,
    textoConfirmar = 'Confirmar',
  ) {
    this.modal.set({ tipo: 'confirmar', titulo, mensaje, textoConfirmar, alConfirmar });
  }

  cerrar() {
    this.modal.set(null);
  }
}
