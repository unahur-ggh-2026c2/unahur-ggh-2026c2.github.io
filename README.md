# 🏛️ Plataforma de Asignaciones - UNAHUR

Plataforma web dinámica e interactiva desarrollada con **Astro** para la gestión de clases, asignaciones, trabajos prácticos y materiales semanales de las materias de la **Universidad Nacional de Hurlingham**. 

Cuenta con una interfaz de usuario (*UI/UX*) moderna en modo oscuro, control de acceso seguro mediante autenticación nativa con **GitHub OAuth (Device Flow)** y un panel de **Historial** para revisar ciclos anteriores de forma controlada.

---

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescriptlogoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![GitHub OAuth](https://img.shields.io/badge/GitHub_OAuth-181717?style=for-the-badge&logo=github&logoColor=white) ![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)

---

## 👥 Guía del Usuario Final (Estudiante)

La plataforma está diseñada para simplificar el acceso a tu cursada:

1. **🔒 Autenticación Segura:** Al ingresar, para ver tu perfil y asegurar que pertenecés a las comisiones oficiales, deberás sincronizar tu cuenta con **GitHub** mediante un código único de verificación (*OAuth Device Flow*). No requiere ingresar contraseñas en nuestro sitio.
2. **📅 Panel Principal (Activas):** Visualizarás de forma clara los contenidos de la semana actual, alertas importantes de los docentes (en rojo/azul), links de Zoom/Meet para clases virtuales o el aula y edificio asignados para clases presenciales.
3. **📂 Entregas de Trabajos:** Cada ejercicio cuenta con un acceso directo a tu repositorio asignado en **GitHub Classroom**, fechas límites de entrega visibles y comentarios aclaratorios.
4. **⏳ Historial de Asignaciones:** Podrás navegar hacia el panel de asignaciones históricas para repasar materiales de ciclos pasados. Tu sesión persistirá localmente en el navegador para que no tengas que loguearte cada vez.

---

## 🛠️ Guía de Inicio (Docentes & Desarrolladores)

### Requisitos Previos
* Instalar **Node.js** (Versión 18 o superior recomendada).
* Una cuenta de GitHub (y configurar una GitHub OAuth App si se modifican los endpoints de autenticación).

### Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala todas las dependencias necesarias del proyecto. |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:4321`. |
| `npm run build` | Compila y optimiza el sitio de producción exportándolo a `./dist/`. |
| `npm run preview` | Previsualiza de forma local la compilación antes de subirla a producción. |

### 🔒 Sistema de Seguridad (OAuth Interno)
Las páginas críticas (`src/pages/index.astro`, `src/pages/historial/index.astro`, etc.) están blindadas mediante scripts inline que verifican la sesión contra el almacenamiento local (`localStorage.getItem("gh_username")`). 
Además, la colección del Historial ejecuta un filtrado reactivo en el servidor para omitir dinámicamente aquellos registros marcados explícitamente con la propiedad `active: false` en sus metadatos.

---

### ✍️ Estructura del Markdown de cada Semana

El contenido de las asignaciones y trabajos prácticos se alimenta mediante archivos Markdown procesados por Astro Content Collections. Los docentes gestionan el estado, las fechas y los repositorios modificando el *Frontmatter* superior del archivo.

#### ⚙️ Propiedades del Frontmatter (Especificación Técnica)

| Llave | Tipo | ¿Opcional? | Descripción / Uso |
| --- | --- | --- | --- |
| `title` | `string` | **No** | Título pedagógico de la semana (Ej: `"Semana 11 - Clases y Herencia"`). |
| `description` | `string` | **No** | Resumen corto que se visualiza en la tarjeta principal del módulo. |
| `fechaPublicacion` | `Date` (AAAA-MM-DD) | **No** | Fecha oficial de publicación. Se utiliza en la UI para ordenar cronológicamente y mostrar la etiqueta temporal. |
| `active` | `boolean` | **Sí** *(default: true)* | Control de visibilidad del sistema. Si se define en `false`, los componentes de filtrado de Astro **ocultan y blindan** este módulo del historial. |
| `ejercicios` | `array` | **Sí** | Listado de trabajos prácticos asignados para esa semana. |
| `ejercicios:[].name` | `string` | *Requerido si hay TP* | Nombre del ejercicio o enunciado. |
| `ejercicios:[].urlTemplate` | `string` (URL) | *Requerido si hay TP* | Enlace base del repositorio template en GitHub. |
| `ejercicios:[].destOrg` | `string` | *Requerido si hay TP* | Organización destino de GitHub Classroom donde se creará el repo del alumno (Ej: `obj1-unahur-2026s1`). |
| `ejercicios:[].type` | `string` | *Requerido si hay TP* | Tipo de asignación: `"individual"` o `"group"`. Modifica la lógica visual y el flujo de GitHub. |
| `ejercicios:[].obligatorio` | `boolean` | **Sí** | Determina si el ejercicio cuenta para las entregas obligatorias regulares. |
| `ejercicios:[].fechaDeEntrega` | `string` | **Sí** | Texto libre para aclarar los plazos de desarrollo o defensas orales. |
| `ejercicios:[].comentarios` | `array` | **Sí** | Notas aclaratorias o tips adicionales en formato `- name: "Texto"`. |

---

### 📝 Ejemplo de Plantilla Oficial Vigente

> **⚠️ Nota de Formato:** Recordar mantener la indentación exacta con espacios (evitar tabulaciones) para que el parser de YAML de Astro compile correctamente las colecciones.

```yaml
---
title: "Semana x - Clases y Herencia"
description: "Profundización en Clases y Herencia. Práctica para el segundo parcial."
fechaPublicacion: 2026-06-15
active: false

ejercicios:
  - name: "TP grupal integrador Wollok Game"
    urlTemplate: "https://github.com/org-unahur/nombre-del-repo"
    destOrg: "org-unahur-2026s1"
    type: "group"
    obligatorio: true
    fechaDeEntrega: "Desarrollo semana del 7/7 | Defensa oral semana del 14/7"
    comentarios:
      - name: "Cada grupo debe aceptar esta tarea, que simplemente creará el repositorio remoto en el que trabajarán."

  - name: "Criaturas mágicas"
    urlTemplate: "https://github.com/org-unahur/nombre-del-repo"
    destOrg: "org-unahur-2026s1"
    type: "individual"
    comentarios:
      - name: "Ejercicio integrador tipo 2do parcial para practicar en clase."
---

Aquí puede ir el cuerpo del Markdown si se desea agregar texto o apuntes adicionales de soporte pedagógico para los alumnos. El layout lo renderizará automáticamente debajo de la sección de ejercicios.
```

