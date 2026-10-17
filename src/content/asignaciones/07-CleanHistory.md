---
title: "Bonus: Limpiar historial"
description: "Material adicional del Taller de Git y GitHub"
fechaPublicacion: 2026-10-17
active: false

    
---

# Guía Práctica: Cómo eliminar archivos sensibles del historial de Git y GitHub

Si has subido por error un archivo con credenciales (como `.env`, contraseñas o tokens) a un repositorio público o privado, no estás solo: es un error muy común. Debes saber que hacer un simple `git rm` o borrar el archivo en un nuevo commit **no es suficiente**, ya que el archivo seguirá visible si navegas por los commits anteriores del historial.

Esta guía te explica, paso a paso, cómo purgar de forma definitiva y segura un archivo de todo el historial de Git sin perder tus commits ni el resto del proyecto.

---

## ⚠️ Paso 0: El paso más importante (Rotación)

**Asume que cualquier secreto que hayas subido a GitHub ya ha sido comprometido.** Los bots automatizados escanean repositorios públicos en segundos. Antes de limpiar el código:

1. **Revoca y cambia inmediatamente** todas las API keys, contraseñas o tokens que hayas expuesto.
2. Genera credenciales nuevas.

---

## Método Recomendado: Usando `git-filter-repo`

`git-filter-repo` es la herramienta oficial recomendada por la documentación de GitHub para reescribir historiales de forma rápida y segura. Reemplaza al antiguo y obsoleto comando `git filter-branch`.

### Paso 1: Instalar la herramienta

`git-filter-repo` requiere tener **Python** instalado en tu sistema.

* **macOS (usando Homebrew):**
  ```bash
  brew install git-filter-repo
  ```
* **Windows / Linux (usando pip):**
  ```bash
  pip install git-filter-repo
  ```

### Paso 2: Crear un clon limpio de respaldo

La reescritura de historial es destructiva. Para evitar accidentes, realiza este proceso en una carpeta nueva y limpia:

```bash
git clone https://github.com/tu-usuario/tu-repo.git repo-limpieza
cd repo-limpieza
```

### Paso 3: Purgar el archivo del historial

Ejecuta el comando de filtrado. Reemplaza `.env` por la ruta exacta del archivo que deseas hacer desaparecer (por ejemplo: `config/secrets.json`):

```bash
git filter-repo --path .env --invert-paths
```

* *¿Qué hace esto?* `--invert-paths` le ordena a Git que conserve absolutamente todo el historial del repositorio, **excepto** el archivo indicado en `--path`.

### Paso 4: Volver a vincular el repositorio remoto

Por seguridad, `git-filter-repo` elimina los enlaces remotos (`remotes`) para evitar que subas cambios al repositorio equivocado por accidente. Debes volver a conectar tu carpeta local con GitHub:

```bash
git remote add origin https://github.com/tu-usuario/tu-repo.git
```

### Paso 5: Forzar la actualización en GitHub

Dado que has reescrito el pasado del repositorio, GitHub rechazará un push normal. Debes realizar un **push forzado** para sobreescribir la historia remota con tu nueva versión limpia:

```bash
# Sube todas las ramas limpias
git push origin --force --all

# Sube todas las etiquetas (tags) limpias si las hubiera
git push origin --force --tags
```

---

## 🔍 Paso 6: Verificación (¿Cómo saber si funcionó?)

Es fundamental que compruebes que el archivo sensible ha desaparecido por completo. Ejecuta estas pruebas:

### 1. Verificación local (Búsqueda en el historial)

En tu terminal, ejecuta el siguiente comando para buscar cualquier commit en cualquier rama que mencione o contenga el archivo eliminado:

```bash
git log --all --full-history -- .env
```

* **Resultado correcto:** La terminal no debe devolver absolutamente nada. Volverá a la línea de comandos vacía. Si aparecen hashes de commits, el proceso no se ejecutó en la ruta correcta.

### 2. Verificación en GitHub (Interfaz Web)

1. Ve a la página de tu repositorio en GitHub.
2. Haz clic en el botón de **Commits** (Historial).
3. Busca un commit antiguo donde sepas con certeza que el archivo `.env` existía.
4. Entra al commit y verifica la lista de archivos modificados: el archivo `.env` ya no debe figurar en la lista ni su contenido debe ser visible.

### 3. Verificación por URL directa (Caché de GitHub)

Aunque los commits ya no se enlacen a tus ramas, GitHub a veces mantiene en caché los commits huérfanos a través de su URL directa temporalmente.

* Intenta acceder a la URL exacta de un commit antiguo conflictivo (por ejemplo: `https://github.com/tu-usuario/tu-repo/commit/HASH_DEL_COMMIT`).
* Si el archivo sigue apareciendo allí por caché de la plataforma y necesitas removerlo con urgencia extrema por seguridad, debes contactar al <a href="https://support.github.com" target="_blank">Soporte de GitHub</a>
 solicitando que fuercen un *"garbage collection"* (recolección de basura) para purgar los commits huérfanos de tu repositorio.

---

## Buenas Prácticas Preventivas

### 1. Configurar el archivo `.gitignore`

Para evitar que este error se repita, asegúrate de indicarle a Git qué archivos debe ignorar por completo. En la raíz de tu proyecto, crea o edita el archivo `.gitignore` e introduce los archivos o carpetas sensibles:

```text
# Archivos de entorno local
.env
.env.local
.env.production

# Archivos de configuración con contraseñas
config/secrets.json
```

### 2. Crear un archivo `.env.example`

Para que cualquier persona que use el proyecto sepa qué variables de entorno necesita para funcionar (sin revelar los valores reales), comparte un archivo de plantilla en el repositorio:

**`.env.example`** (Este archivo **SÍ** se sube al repositorio)

```text
# Configuración de la base de datos (Plantilla)
DB_HOST=localhost
DB_USER=tu_usuario_aqui
DB_PASSWORD=tu_contraseña_aqui

# API Keys
SECRET_KEY_SERVICES=pega_tu_token_aqui
```

---

## 📢 Nota importante si compartes el repositorio con otras personas

Al reescribir el historial de Git, la "huella digital" (hash) de los commits cambia. Si otras personas tienen una copia local del repositorio e intentan hacer `git pull`, experimentarán conflictos graves.

**La solución es simple:** deben borrar su carpeta local vieja y volver a clonar el repositorio recién limpiado desde GitHub.