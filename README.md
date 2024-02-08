<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">Proyecto base implementando Nest.js y TypeORM</p>
    
## Description

Proyecto base implementando:

-   Nest.js
-   TypeORM
-   Swagger - OpenApi
-   Autenticación (basica)

## Dependencias

1.  [Node.js](https://nodejs.org/en) (versión LTS)
2.  Docker - [Windows (Docker descktop)](https://nodejs.org/en)

## Instalación

```bash
$ yarn install
```

## Configuración principal

1. Copiar archivo `.env.template` y renombrar por `.env`

## Ejecución de la aplicación

```bash
# Instalación de imágenes correspondientes y subida de contenedores
$ docker-compose up -d

# Ejecución de aplicación en modo watch
$ yarn start:dev

# Ejecución de migraciones (para la creación de las tablas en la base de datos)
$ yarn migration:run

```

## Documentación de la API

El proyecto está documentado con [Swagger](https://swagger.io/docs/) siguiendo las practicas de OpenApi.

Ruta de documentación: `/api`

## Base de datos y creación de tablas

El proyecto implementa [TypeORM](https://typeorm.io/) como ORM principal.

### Comandos básicos

```bash
# Creación de migraciones
$ npm run migration:create --name=create_NOMBRE_TABLA_table

# Alteración de campos de una tabla
$ npm run migration:create --name=alter_NOMBRE_TABLA_table

# Ejecución de migraciones
$ yarn migration:run

# Revertir migraciones
$ yarn migration:revert

# Refrescar migraciones
$ yarn migration:refresh
```
