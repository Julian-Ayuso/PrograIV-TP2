import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class RegistroDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  nick: string;

  // Al menos 8 caracteres, una mayúscula y un número
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
  })
  pass: string;

  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  fecha: string;

  @IsOptional()
  @IsString()
  @MaxLength(250, { message: 'La descripción es demasiado larga' })
  descripcion?: string;
}
