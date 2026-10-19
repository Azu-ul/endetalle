# enDetalle v7 - Plataforma SaaS de Construcción

Este proyecto es una aplicación web moderna construida con **React, TypeScript y Tailwind CSS**.

## 🚀 Guía Rápida para Generar HTML/CSS (Producción)

Si quieres subir esta web a un hosting como **Hostinger, DonWeb o GoDaddy**, sigue estos pasos para convertir el código en archivos HTML y CSS estándar.

### 1. Generar la "Build" (Construcción)
Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npm run build
```

### 2. Localizar los archivos
Una vez termine el comando, verás una nueva carpeta llamada **`dist`** en tu proyecto.
Esta carpeta contiene tu web lista para usar:

*   `dist/index.html` (El archivo principal)
*   `dist/assets/` (Contiene tus estilos .css y lógica .js)
*   `dist/.htaccess` (Configuración para servidores Apache/Hostinger)

### 3. Subir al Hosting
1.  Ve al administrador de archivos de tu hosting (cPanel / hPanel).
2.  Entra en la carpeta `public_html`.
3.  Borra cualquier archivo por defecto.
4.  **Sube TODO el contenido que hay DENTRO de la carpeta `dist`**.

---

## 🛠 Instalación para Desarrollo (Local)

Si quieres editar el código en tu PC:

1.  Instala las dependencias:
    ```bash
    npm install
    ```
2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 📂 Estructura del Proyecto

*   `src/components`: Todos los componentes visuales (AdminPanel, DetailView, etc).
*   `src/data`: Datos de ejemplo y configuración inicial.
*   `src/services`: Lógica de base de datos (simulada con LocalStorage).
*   `src/types.ts`: Definiciones de datos TypeScript.

## 💾 Base de Datos

Actualmente, la web usa `localStorage` para simular una base de datos.
*   Los datos persisten en el navegador del usuario.
*   Para migrar a **MySQL/PHP**, revisa el archivo `database_schema.sql` incluido en la raíz.
