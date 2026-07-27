package edu.unah.kolvix.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.archivo.ArchivoResponse;

@Service
public class ArchivoService {

    private static final Set<String> EXTENSIONES_PERMITIDAS = Set.of("jpg", "jpeg", "png");

    @Value("${kolvix.uploads.dir:uploads}")
    private String uploadsDir;

    public ArchivoResponse guardarImagen(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El archivo está vacío");
        }

        String nombreOriginal = archivo.getOriginalFilename() != null ? archivo.getOriginalFilename() : "imagen";
        String extension = extraerExtension(nombreOriginal);
        if (!EXTENSIONES_PERMITIDAS.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo se permiten imágenes .jpg y .png");
        }

        String nombreArchivo = UUID.randomUUID() + "." + extension;
        Path directorio = Paths.get(uploadsDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(directorio);
            try (var stream = archivo.getInputStream()) {
                Files.copy(stream, directorio.resolve(nombreArchivo), StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar el archivo");
        }

        return new ArchivoResponse("/uploads/" + nombreArchivo, nombreOriginal);
    }

    private String extraerExtension(String nombre) {
        int punto = nombre.lastIndexOf('.');
        if (punto < 0 || punto == nombre.length() - 1) {
            return "";
        }
        return nombre.substring(punto + 1).toLowerCase(Locale.ROOT);
    }
}
