# Instrucciones paso a paso para monolito-rifa

1. Copia `.env.example` a `.env` y edita los valores.
2. Instala dependencias:
   npm install
3. Inicializa la base de datos PostgreSQL:
   psql -U tu_usuario -d rifa_db -f server/init.sql
4. Para desarrollo (Angular + backend):
   npm run dev
5. Para producción (build Angular y servir con Express):
   npm run build
   npm start

# Notas
- El backend Express sirve el build Angular desde /dist
- El proxy de Angular redirige /api al backend en desarrollo
- Compatible con Railway (usa variables de entorno)
- Código comentado y manejo de errores claro
- Personaliza imágenes y enlaces en el frontend

# Despliegue Railway
- Sube el proyecto a Railway
- Configura variables de entorno según `.env.example`
- Railway detecta automáticamente el script `npm start`
