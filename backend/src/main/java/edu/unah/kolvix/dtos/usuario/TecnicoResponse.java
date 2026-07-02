package edu.unah.kolvix.dtos.usuario;

import java.time.LocalDate;

public record TecnicoResponse(
    Long idTecnico,
    Long idEmpresa,
    Long idUsuario,
    String nombre, 
    String apellido,
    String correo, 
    String dni,
    String rtn,
    String direccion,
    String telefono, 
    LocalDate fechaNacimiento,
    String nombreContactoEmergencia,
    String telefonoContactoEmergencia,
    String urlFotografia,
    boolean activo
) {

}
