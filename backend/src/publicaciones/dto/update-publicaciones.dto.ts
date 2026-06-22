import { IsMongoId } from 'class-validator';

export class AccionUsuarioDto {
  @IsMongoId({ message: 'El usuario no es válido' })
  usuarioId: string;
}
