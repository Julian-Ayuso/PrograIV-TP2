import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(120, { message: 'El título es demasiado largo' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @MaxLength(1000, { message: 'El mensaje es demasiado largo' })
  descripcion: string;

  // TEMPORAL (Sprint 2): el autor llega en el body porque todavía no hay token.
  // En el Sprint 3, esto se elimina y el autor se extrae del JWT con un guard.
  @IsMongoId({ message: 'El autor no es válido' })
  autorId: string;
}
