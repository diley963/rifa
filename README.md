# Monolito Rifa BMX

Aplicación monolítica para gestionar una rifa de números del 1 al 100, usando Angular (frontend), Node.js + Express (backend) y PostgreSQL (base de datos).

## Estructura del proyecto

```
monolito-rifa/
├─ server/         # Backend Node.js + Express
├─ client/         # Frontend Angular
├─ dist/           # Build Angular servido por Express
├─ .env            # Variables de entorno
├─ package.json    # Dependencias y scripts
└─ README.md
```

## Instalación y uso rápido

1. Clona el repositorio y entra al directorio.
2. Copia `.env.example` a `.env` y edita los valores.
3. Instala dependencias:
   ```sh
   npm install
   ```
4. Inicializa la base de datos PostgreSQL:
   ```sh
   psql -U tu_usuario -d rifa_db -f server/init.sql
   ```
5. Para desarrollo (Angular + backend):
   ```sh
   npm run dev
   ```
6. Para producción (build Angular y servir con Express):
   ```sh
   npm run build
   npm start
   ```

## Despliegue en Railway

- Sube el proyecto a Railway.
- Configura las variables de entorno según `.env.example`.
- Railway detecta automáticamente el script `npm start`.

## Estructura de carpetas y archivos

- `server/` Backend Express y lógica de API
- `client/` Angular (mobile first, visual deportivo)
- `dist/` Build Angular (servido por Express)
- `.env` Variables de entorno
- `server/init.sql` Script SQL para PostgreSQL

## Scripts útiles

- `npm run dev`  → Modo desarrollo (Angular + backend)
- `npm run build` → Compila Angular y copia a `dist/`
- `npm start`    → Inicia backend y sirve Angular

## Notas

- Código comentado para principiantes
- Sin librerías pesadas
- Compatible con Railway
- Manejo de errores claro
- Instrucciones paso a paso

---

ffffff 🚴‍♂️
