package edu.unah.kolvix.entities;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import edu.unah.kolvix.enums.RolUsuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "correo")    
    private String correo;

    @Column(name = "password_hash")  
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 20)
    private RolUsuario rol = RolUsuario.RECEPCIONISTA;

    private boolean activo =  true;

    @Column(name = "debe_cambiar_password")
    private boolean debeCambiarPassword = false;

    @Column(name = "ultimo_acceso")
    private Instant ultimoAcceso;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;


    // UserDetails

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getUsername() {
        return correo;
    }

    @Override
    public boolean isAccountNonExpired(){
        return true;
     }
    @Override
    public boolean isAccountNonLocked(){
        return true;
     }
    @Override
    public boolean isCredentialsNonExpired(){
        return true; 
    }
    @Override
    public boolean isEnabled(){ 
        return activo;
    }

    public String obtenerIniciales() {
        String i1 = (nombre != null && !nombre.isBlank()) ? nombre.substring(0, 1) : "";
        String i2 = (apellido != null && !apellido.isBlank()) ? apellido.substring(0, 1) : "";
        return (i1 + i2).toUpperCase();
    }
}
