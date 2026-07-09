package edu.unah.kolvix.Jwt;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import edu.unah.kolvix.entities.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // TODO: Clave secreta para firmar los tokens. Temporal.
    private static final String SECRET_KEY = "CLAVE_SECRETA_KOLVIX_INDUSTRIA_SOFTWARE_2026_CAMBIAR_EN_PROD";
    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 10; // 10 horas

    public String getToken(Usuario usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("idEmpresa", usuario.getEmpresa().getIdEmpresa());
        claims.put("rol", usuario.getRol().name());
        claims.put("nombre", usuario.getNombre() + " " + usuario.getApellido());
        return getToken(claims, usuario);
    }

    public String getToken(Map<String, Object> claims, UserDetails usuario) {
        return Jwts.builder()
                .claims(claims)
                .subject(usuario.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getKey())
                .compact();
    }

    private Key getKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public Long getIdEmpresaFromToken(String token) {
        return getClaim(token, claims -> claims.get("idEmpresa", Long.class));
    }

    public String getRolFromToken(String token) {
        return getClaim(token, claims -> claims.get("rol", String.class));
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T getClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(getAllClaims(token));
    }

    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }
    
}
