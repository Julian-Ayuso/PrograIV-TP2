import { IsMongoId } from 'class-validator';

// Reutilizado para: dar/quitar me gusta y para eliminar (quién solicita).
// TEMPORAL (Sprint 2): el id del usuario viaja en el body.
// En Sprint 3 sale del token.
export class AccionUsuarioDto {
  @IsMongoId({ message: 'El usuario no es válido' })
  usuarioId: string;
}
