# 🏛️ Plataforma de Asignaciones - UNAHUR

![Astro](https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescriptlogoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) ![GitHub OAuth](https://img.shields.io/badge/GitHub-OAuth-blue?logo=github) ![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-orange) ![Versión](https://img.shields.io/badge/Versi%C3%B3n-v1.9.0--beta-yellow) ![Licencia](https://img.shields.io/badge/Licencia-MIT-green)


Plataforma web dinámica e interactiva desarrollada con **Astro** para la gestión de clases, asignaciones, trabajos prácticos, **grabaciones de encuentros y recursos adicionales** de las materias de la **Universidad Nacional de Hurlingham**.

Cuenta con una interfaz de usuario (*UI/UX*) moderna en modo oscuro, control de acceso seguro mediante autenticación nativa con **GitHub OAuth (Device Flow)** y un panel de **Historial** para revisar ciclos anteriores de forma controlada.

Su arquitectura basada en **Astro Content Collections** permite subir cualquier archivo Markdown (`.md`) para ser interpretado automáticamente. La plataforma no solo gestiona la clonación automática de ejercicios de GitHub, sino que soporta páginas informativas completas, cronogramas, reproductores de video incrustados y fichas de recursos externos.

🌐 **Deploy:** [https://unahur-ggh-2026c2.github.io/](https://unahur-ggh-2026c2.github.io/)

---

## 👥 Guía del Usuario Final (Estudiante)

La plataforma está diseñada para simplificar el acceso a tu cursada:

1. **🔒 Autenticación Segura:** Al ingresar, para ver tu perfil y asegurar que pertenecés a las comisiones oficiales, deberás sincronizar tu cuenta con **GitHub** mediante un código único de verificación (*OAuth Device Flow*). No requiere ingresar contraseñas en nuestro sitio.


2. **📅 Panel Principal (Activas):** Visualizarás de forma clara los contenidos de la semana actual, alertas importantes de los docentes, enlaces directos a encuentros sincrónicos (Google Meet/Zoom) y grabaciones de clases anteriores.


3. **📂 Entregas y Materiales:** Podrás aceptar y crear tus repositorios de **GitHub Classroom**, consultar material de lectura, acceder a *cheatsheets* o recursos adicionales y reproducir videos embebidos de los encuentros.


4. **⏳ Historial de Asignaciones:** Podrás navegar hacia el panel de asignaciones históricas para repasar materiales de ciclos pasados. Tu sesión persistirá localmente en el navegador para que no tengas que loguearte cada vez.



---

## 🛠️ Guía de Inicio (Docentes & Desarrolladores)

### Requisitos Previos

* Instalar **Node.js** (Versión 18 o superior recomendada).
* Una cuenta de GitHub (y configurar una GitHub OAuth App si se modifican los endpoints de autenticación).

### Comandos Disponibles

| Comando | Acción |
| --- | --- |
| `npm install` | Instala todas las dependencias necesarias del proyecto. |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:4321`. |
| `npm run build` | Compila y optimiza el sitio de producción exportándolo a `./dist/`. |
| `npm run preview` | Previsualiza de forma local la compilación antes de subirla a producción. |

### 🔒 Sistema de Seguridad (OAuth Interno)

Las páginas críticas (`src/pages/index.astro`, `src/pages/historial/index.astro`, etc.) están blindadas mediante scripts inline que verifican la sesión contra el almacenamiento local (`localStorage.getItem("gh_username")`).
Además, el sistema ejecuta un filtrado reactivo para omitir dinámicamente aquellos registros marcados explícitamente con la propiedad `active: false` en sus metadatos.

---

### ✍️ Estructura del Markdown de cada Semana

El contenido de cada módulo o semana se alimenta mediante archivos Markdown procesados por **Astro Content Collections**. Los archivos `.md` colocados en la colección son parseados automáticamente, interpretando correctamente las claves declaradas en el metadato inicial (*Frontmatter*) y procesando el texto o elementos multimedia del cuerpo.

Un archivo `.md` no está restringido a contener repositorios de código: puede incluir combinaciones de **ejercicios de GitHub**, **tarjetas de recursos/enlaces externos** o **contenido Markdown con videos incrustados**.

#### ⚙️ Propiedades del Frontmatter (Especificación Técnica)

| Llave | Tipo | ¿Opcional? | Descripción / Uso |
| --- | --- | --- | --- |
| `title` | `string` | **No** | Título principal del módulo (Ej: `"Semana 04 - Estructuras de Datos"`). |
| `description` | `string` | **No** | Resumen explicativo mostrado en la tarjeta del panel principal. |
| `fechaPublicacion` | `Date` (AAAA-MM-DD) | **No** | Fecha de publicación para ordenamiento temporal. |
| `active` | `boolean` | **Sí** *(default: true)* | Estado de visibilidad. Si es `false`, oculta el contenido de los listados. |
| `ejercicios` | `array` | **Sí** | Lista de trabajos prácticos o repositorios de la semana. |
| `ejercicios:[].name` | `string` | *Requerido si hay ejercicios* | Nombre del trabajo o enunciado. |
| `ejercicios:[].urlTemplate` | `string` | *Requerido si hay ejercicios* | Enlace base del repositorio *template* en GitHub. |
| `ejercicios:[].destOrg` | `string` | *Requerido si hay ejercicios* | Organización destino de GitHub (Ej: `"org-materia-2026"`) o `"no-create"` para repositorios monolíticos. |
| `ejercicios:[].type` | `string` | *Requerido si hay ejercicios* | Modalidad: `"individual"` o `"group"`. |
| `ejercicios:[].obligatorio` | `boolean` | **Sí** | Marca si la entrega cuenta para la regularidad. |
| `ejercicios:[].asignacion` | `boolean` | **Sí** | Define si habilita el botón de clonación/aceptación (`true`) o solo lectura (`false`). |
| `ejercicios:[].prefix` | `string` | **Sí** | Prefijo para nombrar la entrega en la organización destino (Ej: `"tp-arboles"`). |
| `ejercicios:[].comentarios` | `array` | **Sí** | Indicaciones o notas adicionales en formato `- name: "Texto"`. |
| `recursos` | `array` | **Sí** | Bloque para enlaces externos, aulas virtuales o documentación. |
| `recursos:[].titulo` | `string` | *Requerido si hay recurso* | Nombre visible del recurso (Ej: `"🎥 Aula Virtual (Zoom)"`). |
| `recursos:[].url` | `string` | *Requerido si hay recurso* | Enlace web o URL directa al recurso. |
| `recursos:[].description` *(o `descripcion`)* | `string` | **Sí** | Explicación o detalle complementario del recurso. |
| `recursos:[].badge` | `string` | **Sí** | Etiqueta gráfica para clasificar el recurso (Ej: `"Zoom"`, `"PDF"`, `"Oficial"`). |

---

### 📹 Videos e Integración en el Cuerpo del Documento

Para agregar grabaciones de clase, teoría explicativa o tablas de contenidos, se utiliza directamente el cuerpo del archivo Markdown debajo de la línea divisoria `---`:

* **Incrustar Videos:** Podés incluir reproductores de video mediante etiquetas HTML estándar (como `<iframe src="..."></iframe>` de Google Drive, YouTube, Vimeo, etc.).


* **Formato Enriquecido:** Soporta sintaxis Markdown completa (tablas de cronogramas, sintaxis de código, enlaces, imágenes).



---

### 📝 Ejemplo de Plantilla Oficial Vigente (Multicontenido)

> **⚠️ Nota de Formato:** Mantener la indentación exacta con espacios (sin usar tabulaciones) para asegurar el procesamiento correcto por parte del parser YAML de Astro.
> 
> 

```md
---
title: "🚀 Semana 04 - Estructuras de Datos y Complejidad"
description: "Conceptos clave de Árboles y Grafos, ejercicios prácticos y recursos sincrónicos."
fechaPublicacion: 2026-05-10
active: true

ejercicios:  
  - name: "💻 TP 1: Implementación de Árboles Binarios"
    urlTemplate: "https://github.com/org-ejemplo/tp-arboles-template"
    destOrg: "org-materia-2026"
    type: "individual"
    obligatorio: true
    prefix: "tp-arboles"
    comentarios:
      - name: "Al aceptar este trabajo se creará tu repositorio personal de desarrollo."

  - name: "📚 Repositorio de Códigos de Ejemplo de Clase"
    urlTemplate: "https://github.com/org-ejemplo/ejemplos-teoria"
    destOrg: "no-create"
    type: "individual"
    obligatorio: false
    asignacion: false # <-- En false desactiva el botón de creación de repositorio
    prefix: ""
    comentarios:
      - name: "Repositorio monolítico para consultar el código visto durante las clases teóricas."

recursos:
  - titulo: "🎥 Aula Virtual para Encuentros Sincrónicos"
    url: "https://zoom.us/j/1234567890"
    description: "Acceso a las videollamadas en vivo de los días martes."
    badge: "Zoom"

  - titulo: "📄 Documentación de Referencia del Lenguaje"
    url: "https://ejemplo.org/docs/manual"
    descripcion: "Manual oficial recomendado para la resolución de los TPs."
    badge: "Oficial"
---

# 📽️ Grabación de la Clase Teórica

Si no pudiste asistir al encuentro sincrónico de esta semana, podés repasar la explicación teórica en el siguiente reproductor:

<iframe 
  src="https://drive.google.com/file/d/1ABCXYZ_EJEMPLO_VIDEO_ID/preview" 
  width="100%" 
  height="480" 
  allow="autoplay" 
  allowfullscreen
  style="border: 0;">
</iframe>

---

## 📅 Cronograma de Contenidos

| Módulo | Tema Principal | Estado |
| ------ | -------------- | ------ |
| **01** | Introducción y Complejidad Algorítmica | Finalizado |
| **02** | Estructuras Lineales: Pilas y Colas | Finalizado |
| **03** | Árboles Binarios y Recorridos | En Curso |

```