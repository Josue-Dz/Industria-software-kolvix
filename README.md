# Kolvix 📱🔧

**La confianza ya no tiene que ser una promesa de palabra.**

Kolvix es una plataforma SaaS multi-tenant para talleres de reparación de celulares y hardware, que digitaliza la recepción de equipos, certifica el estado físico del dispositivo con evidencia fotográfica y aprobación del cliente, y organiza la gestión interna de técnicos e inventario.

🏆 Ganador de primer lugar — Mejor StartUp, StartUp Battle 2026.
🌐 Sitio en producción: **[kolvix.app](https://kolvix.app)**

Proyecto desarrollado para el curso de Industria de Software, UNAH.

---

## 📌 El problema

La mayoría de los talleres técnicos en Honduras reciben equipos anotando los datos a mano, sin fotos ni firmas seguras. Esto genera disputas constantes entre clientes y talleres sobre daños preexistentes, pérdidas económicas para el negocio y daño reputacional en redes sociales.

## 💡 La solución

Kolvix permite al técnico inspeccionar el dispositivo frente al cliente y trazar digitalmente los rayones y abolladuras sobre un chasis virtual interactivo, exige fotos obligatorias de cuatro ángulos al ingreso, y hace que el cliente certifique el estado del equipo tanto al entregarlo como al recogerlo.

## ✨ Funcionalidades principales

- **Inspección digital certificada** — chasis virtual interactivo + evidencia fotográfica obligatoria (4 ángulos)
- **Flujo de reparación en 8 fases** — desde ingreso hasta entrega, con auditoría completa
- **Aprobación de cotización vía WhatsApp** — el cliente aprueba o rechaza la reparación con un clic
- **Gestión de técnicos e inventario** — con alertas visuales cuando el stock de repuestos llega a nivel crítico
- **Marketplace de talleres** — búsqueda por ubicación y reputación (calificaciones de clientes previos)
- **Seguimiento público de órdenes** — el cliente monitorea el progreso de su reparación con un código único
- **Arquitectura multi-tenant** — cada taller opera de forma aislada y segura sobre la misma plataforma
- **Roles diferenciados** — `ADMIN`, `TECNICO`, `RECEPCIONISTA`, `PROPIETARIO`
- **Notificaciones por correo** — vía SMTP para avisos y confirmaciones

## 🏗️ Arquitectura

**Backend:** Java 17 · Spring Boot 3.5 · Spring Security · Spring Data JPA · JWT (`jjwt`) · PostgreSQL · Lombok
**Frontend:** React 19 · TypeScript · Vite · React Router · Axios · pnpm

**Autenticación:** JWT con `idEmpresa` como claim para aislamiento multi-tenant, entrega del token vía cookie `HttpOnly`, creación atómica de empresa + usuario administrador en una sola transacción.

```
Industria-software-kolvix/
├── backend/
│   ├── src/main/java/edu/unah/kolvix/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── dtos/
│   │   ├── model/
│   │   ├── enums/
│   │   ├── events/ & listeners/
│   │   ├── Jwt/ & JwtConfig/
│   │   └── config/
│   ├── database/          # scripts SQL de inicialización
│   ├── compose.yaml        # PostgreSQL vía Docker
│   └── pom.xml
├── frontend/
│   ├── src/
│   └── package.json
└── .github/workflows/       # CI backend y frontend
```

## 🚀 Cómo levantar el proyecto localmente

### Requisitos previos
- Java 17
- Node.js ≥ 22.12
- pnpm 10
- Docker (para la base de datos)

### 1. Base de datos
```bash
cd backend
docker compose up -d
```
Esto levanta PostgreSQL en el puerto `5432` con la base `kolvix_bd` (ver `compose.yaml`).

### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
```
La API queda disponible en `http://localhost:8080` en local. En producción, Kolvix está desplegado en **[kolvix.app](https://kolvix.app)**.

### 3. Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

## 🧪 CI

El repositorio incluye workflows de GitHub Actions (`.github/workflows/`) para integración continua de `backend` y `frontend`.

## 👥 Equipo

| Rol | Nombre |
|---|---|
| CEO | José Núñez |
| CTO | Ronny Díaz |
| UX/UI | David Parada |
| Operations & Customer Success | Ashley Silva |
| Product Manager | Nohely Reyes |

## 🗺️ Roadmap

- [ ] Logística puerta a puerta (recolección con mensajero)
- [ ] Pasarelas de pago locales (tarjetas y billeteras digitales)
- [ ] Integración directa con importadores de repuestos
- [ ] Modo offline con sincronización posterior

Hecho con 💜 en Honduras.

