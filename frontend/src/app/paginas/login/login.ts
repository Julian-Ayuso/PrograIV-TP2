import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth';
import { Modal } from '../../servicios/modal';

// Misma regla que el back: 8+ caracteres, una mayúscula y un número
export const REGEX_CONTRASENA = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private modal = inject(Modal);
  private router = inject(Router);

  enviando = false;

  formulario = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    contrasena: ['', [Validators.required, Validators.pattern(REGEX_CONTRASENA)]],
  });

  // Helper para pintar errores solo cuando el campo fue tocado
  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const { usuario, contrasena } = this.formulario.getRawValue();

    this.auth.login(usuario, contrasena).subscribe({
      next: (usuarioLogueado) => {
        this.auth.guardarSesion(usuarioLogueado);
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.enviando = false;
        this.modal.mostrar({
          tipo: 'error',
          titulo: 'No pudimos iniciar tu sesión',
          mensaje:
            err.status === 401
              ? 'El usuario o la contraseña son incorrectos. Revisalos e intentá de nuevo.'
              : 'El servidor no respondió. Verificá que esté levantado e intentá otra vez.',
        });
      },
    });
  }
}
