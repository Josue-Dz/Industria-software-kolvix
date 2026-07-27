# Use the official PostgreSQL image
FROM postgres:16

# Updated default environment variables
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

# Copy the DDL script into the initialization directory
COPY init.sql /docker-entrypoint-initdb.d/