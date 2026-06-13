import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  // Puede ser el correo o el nombre de usuario
  @IsString()
  @IsNotEmpty({ message: 'El usuario o correo es obligatorio' })
  usuario: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contrasena: string;
}
