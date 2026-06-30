package edu.unah.kolvix.entities;

import edu.unah.kolvix.enums.AlbumEvidenciaCodigo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "albumes_evidencia")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AlbumEvidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_album")
    private Short id;

    @Enumerated(EnumType.STRING)
    private AlbumEvidenciaCodigo codigo;

    private String titulo;

    private String descripcion;

    private boolean obligatorio;

    private short orden;

    private boolean activo = true;

}
