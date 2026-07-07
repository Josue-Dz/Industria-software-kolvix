# Use the official PostgreSQL image
FROM postgres:16

# Updated default environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=sysdevjdz26
ENV POSTGRES_DB=kolvix_bd 

# Copy the DDL script into the initialization directory
COPY init.sql /docker-entrypoint-initdb.d/