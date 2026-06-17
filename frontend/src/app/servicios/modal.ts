import { Injectable, signal } from '@angular/core';

export interface DatosModal {
  tipo: 'exito' | 'error' | 'info' | 'confirmar';
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  alConfirmar?: () => void;
}

@Injectable({ providedIn: 'root' })
export class Modal {
  modal = signal<DatosModal | null>(null);

  mostrar(datos: DatosModal) {
    this.modal.set(datos);
  }

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
