# Seeders de Base de Datos

Este directorio contiene los seeders para poblar la base de datos con datos de prueba.

## Estructura

- `seeder.module.ts`: Módulo principal para ejecutar el seeding de forma independiente
- `seeders.module.ts`: Módulo que define los modelos necesarios
- `seeders.service.ts`: Servicio que contiene la lógica de seeding
- `seed.ts`: Script de entrada para ejecutar el seeding

## Datos Generados

El seeder crea datos de ejemplo para las siguientes entidades:

### 1. Usuarios (5 usuarios)
- 4 clientes y 1 administrador
- Contraseña por defecto: `password123` (hasheada con SHA256)

### 2. Clientes (4 clientes)
- Vinculados a usuarios específicos
- Con identificación única

### 3. Países (3 países)
- España (con Madrid, Cataluña y Andalucía)
- México (con CDMX y Jalisco)
- Colombia (con Cundinamarca y Antioquia)
- Cada estado incluye varias ciudades

### 4. Categorías (6 categorías)
- Electrónica
- Ropa
- Hogar
- Deportes
- Libros
- Juguetes

### 5. Proveedores (5 proveedores)
- Distribuidores de diferentes países
- Especializados en distintas categorías

### 6. Productos (12 productos)
- Variedad de productos en diferentes categorías
- Con precios, stock, ratings y descuentos
- Imágenes de Unsplash

### 7. Métodos de Pago (4 métodos)
- Tarjetas de crédito (3)
- Tarjeta de regalo (1)

### 8. Ventas (6 ventas)
- Distribuidas entre diferentes clientes
- Con múltiples productos
- Fechas recientes

## Uso

### Ejecutar el Seeder

```bash
# Desde el directorio backend
npm run seed
```

### Requisitos Previos

1. Asegúrate de que MongoDB esté corriendo
2. Configura la variable de entorno `MONGO_URI` en tu archivo `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/ecommerce
   ```

### Comportamiento

El seeder:
1. **Limpia** toda la base de datos existente
2. **Crea** datos en el siguiente orden (respetando dependencias):
   - Usuarios
   - Clientes
   - Países
   - Categorías
   - Proveedores
   - Productos
   - Métodos de Pago
   - Ventas

### Advertencia

⚠️ **ATENCIÓN**: El seeder elimina todos los datos existentes antes de insertar los nuevos. No ejecutes esto en un entorno de producción.

## Personalización

Para personalizar los datos:

1. Edita `seeders.service.ts`
2. Modifica los arrays de datos en cada método `seed*()`
3. Ejecuta nuevamente `npm run seed`

## Ejemplos de Datos

### Usuario de Prueba
- Email: `juan.perez@example.com`
- Password: `password123`
- Rol: `customer`

### Admin de Prueba
- Email: `ana.martinez@example.com`
- Password: `password123`
- Rol: `admin`

## Troubleshooting

Si encuentras errores:

1. Verifica que MongoDB esté corriendo
2. Comprueba que la URI de conexión sea correcta
3. Asegúrate de tener los permisos necesarios en la base de datos
4. Revisa que todas las dependencias estén instaladas (`npm install`)
