package edu.unah.kolvix.JwtConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import edu.unah.kolvix.Jwt.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/crear", "/api/auth/login", "/error").   
                                        permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers("/api/seguimiento/**").permitAll()
                        .requestMatchers("/api/usuarios/**").hasAnyRole("ADMIN",           
                                        "PROPIETARIO")
                        .requestMatchers("/api/tecnicos/me").hasAnyRole("ADMIN",        
                                        "PROPIETARIO", "TECNICO")
                        .requestMatchers("/api/tecnicos/**").hasAnyRole("ADMIN", 
                                        "PROPIETARIO")
                        .requestMatchers(HttpMethod.GET, "/api/estados-reparacion/**").
                                        authenticated()
                        .requestMatchers("/api/estados-reparacion/**").hasAnyRole("ADMIN", 
                                        "PROPIETARIO")
                        .requestMatchers("/api/cuentas-pago-taller/**").hasAnyRole("ADMIN", 
                                        "PROPIETARIO")
                        .requestMatchers(HttpMethod.GET, "/api/cotizaciones/**").
                                        authenticated()
                        .requestMatchers("/api/cotizaciones/**").hasAnyRole("ADMIN", 
                                        "PROPIETARIO", "RECEPCIONISTA")
                        .requestMatchers("/api/mi-taller/**").hasAnyRole("ADMIN", 
                                        "PROPIETARIO")
                        .requestMatchers(HttpMethod.GET, "/api/empresa/**").authenticated()
                        .requestMatchers("/api/empresa/**").hasAnyRole("ADMIN", 
                                        "PROPIETARIO")
                        .requestMatchers("/api/marketplace/**").permitAll()
                        .requestMatchers("/api/catalogos/**").permitAll()
                        .requestMatchers("/api/reviews/**").permitAll()
                        .requestMatchers("/api/mi-taller/categorias-servicio/**").hasAnyRole
                                        ("ADMIN", "PROPIETARIO")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter,       
                                UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(
                        (request, response, authException) -> response.setStatus(HttpServletResponse.SC_UNAUTHORIZED)))
                .build();
    }
}
