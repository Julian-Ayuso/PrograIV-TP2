import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth';
import { Modal } from '../../servicios/modal';
import { REGEX_CONTRASENA } from '../login/login';

function contrasenasIguales(grupo: AbstractControl): ValidationErrors | null {
  const pass = grupo.get('contrasena')?.value;
  const repetida = grupo.get('repetirContrasena')?.value;
  return pass && repetida && pass !== repetida ? { distintas: true } : null;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
})

export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private modal = inject(Modal);
  private router = inject(Router);

  enviando = false;
  imagenSeleccionada: File | null = null;
  vistaPrevia: string | null = null;

  formulario = this.fb.nonNullable.group(
    {
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasena: ['', [Validators.required, Validators.pattern(REGEX_CONTRASENA)]],
      repetirContrasena: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.maxLength(250)],
    },
    { validators: contrasenasIguales },
  );

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  get contrasenasDistintas(): boolean {
    const repetida = this.formulario.get('repetirContrasena');
    return (
      this.formulario.hasError('distintas') &&
      !!repetida && (repetida.touched || repetida.dirty)
    );
  }

  seleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    this.imagenSeleccionada = archivo;

    if (archivo) {
      const lector = new FileReader();
      lector.onload = () => (this.vistaPrevia = lector.result as string);
      lector.readAsDataURL(archivo);
    } else {
      this.vistaPrevia = null;
    }
  }

  enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando = true;

    const valores = this.formulario.getRawValue();
    const datos = new FormData();
    datos.append('nombre', valores.nombre);
    datos.append('apellido', valores.apellido);
    datos.append('correo', valores.correo);
    datos.append('nick', valores.nombreUsuario);
    datos.append('pass', valores.contrasena);
    datos.append('fecha', valores.fechaNacimiento);
    datos.append('descripcion', valores.descripcion);
    if (this.imagenSeleccionada) {
      datos.append('imagenPerfil', this.imagenSeleccionada);
    }

    this.auth.registrar(datos).subscribe({
      next: () => {
        this.modal.mostrar({
          tipo: 'exito',
          titulo: '¡Cuenta creada!',
          mensaje: 'Ya podés ingresar con tu usuario y contraseña.',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.enviando = false;
        this.modal.mostrar({
          tipo: 'error',
          titulo: 'No pudimos crear tu cuenta',
          mensaje:
            err.status === 409
              ? 'Ese correo o nombre de usuario ya está en uso. Probá con otro.'
              : err.error?.message?.toString() ??
                'Revisá los datos del formulario e intentá de nuevo.',
        });
      },
    });
  }
}
