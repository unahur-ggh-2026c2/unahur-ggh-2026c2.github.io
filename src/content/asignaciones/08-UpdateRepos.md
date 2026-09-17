---
title: "Actualización de repos de origen mixto"
description: "Guía paso a paso para actualizar repositoirios de origen mixto"
fechaPublicacion: 2026-09-12
active: false
---

# 📚 Guía: Cómo actualizar tu repositorio desde la Plantilla Base (Template)

Esta guía explica cómo sincronizar tu repositorio local con las correcciones o actualizaciones que el equipo docente realice en el repositorio base/plantilla durante el transcurso de la cursada.

---

## 💡 El concepto: `origin` vs `upstream`

En Git, un repositorio puede conectarse a múltiples servidores remotos:

* **`origin`**: Es tu copia personal del repositorio (donde trabajas y subes tus entregas).
* **`upstream`**: Es el repositorio base o plantilla original mantenido por los docentes.

---

## 🛠️ Parte 1: Instrucciones para Alumnos (Paso a paso)

Si los docentes avisaron que corrigieron un error en la consigna o código inicial, sigue estos pasos desde la terminal de tu proyecto:

### 1. Asegúrate de tener tu trabajo guardado

Antes de traer cambios, guarda tu trabajo actual para evitar perder nada:

```bash
git status
git add .
git commit -m "Guardando cambios locales antes de actualizar"

```

---

### 2. Configurar el remoto `upstream` (Solo se hace la primera vez)

Verifica qué remotos tienes configurados:

```bash
git remote -v

```

Si solo ves `origin`, agrega el repositorio plantilla del docente como `upstream`:

```bash
git remote add upstream <URL_DEL_REPOSITORIO_PLANTILLA_DOCENTE>

```

*(Reemplaza `<URL_DEL_REPOSITORIO_PLANTILLA_DOCENTE>` por el link HTTPS o SSH del repo de la cátedra).*

---

### 3. Descargar las novedades del repositorio docente

Descarga los últimos commits del servidor base sin modificar tu código todavía:

```bash
git fetch upstream

```

---

### 4. Fusionar los cambios en tu repositorio

Integra las correcciones en tu rama actual (usualmente `main` o `master`):

```bash
git merge upstream/main --allow-unrelated-histories -m "Sincronizando correcciones de la plantilla"

```

> ⚠️ **¿Por qué usamos `--allow-unrelated-histories`?**
> Cuando GitHub crea un repositorio a partir de un *Template*, genera un historial nuevo. Este flag le indica a Git que permita unir ambos historiales aunque no compartan el primer commit.

---

### 5. Resolver conflictos (si los hay) y subir los cambios

1. Si hubo conflictos en algún archivo que ya habías modificado, ábrelo en tu editor (VS Code, etc.), elige qué cambios conservar y guarda el archivo.
2. Haz commit de la resolución y sube los cambios a tu copia en GitHub:

```bash
git add .
git commit -m "Resolviendo conflictos de actualización"
git push origin main

```

¡Listo! Tu repositorio ya tiene las correcciones del equipo docente sin haber perdido tu trabajo.

---

## 🤖 Parte 2: Para el Equipo Docente (Automatización Masiva)

Si el equipo docente administra la organización y tiene permisos de escritura en los repositorios de los alumnos, se puede automatizar este proceso para decenas o cientos de repositorios mediante un script Bash sin depender de que cada alumno lo ejecute manualmente.

### Script Bash de actualización masiva (`update_all.sh`)

Crea un archivo `update_all.sh` y ejecuta el script en una carpeta temporal:

```bash
#!/bin/bash

# Configuración
TEMPLATE_REPO="https://github.com/TU_ORGANIZACION/repo-plantilla-original.git"
BRANCH="main"

# Lista de nombres de repositorios de alumnos (o lee desde un archivo txt)
REPOS=(
  "entrega-alumno1"
  "entrega-alumno2"
  "entrega-alumno3"
)

ORGANIZATION_URL="https://github.com/TU_ORGANIZACION"

echo "🚀 Iniciando actualización masiva de repositorios..."

for REPO in "${REPOS[@]}"; do
  echo "------------------------------------------------"
  echo "🔄 Procesando: $REPO"
  
  # Clonar el repo del alumno
  git clone "$ORGANIZATION_URL/$REPO.git"
  cd "$REPO" || continue
  
  # Agregar remoto upstream y traer cambios
  git remote add upstream "$TEMPLATE_REPO"
  git fetch upstream
  
  # Intentar merge automático
  git merge "upstream/$BRANCH" --allow-unrelated-histories -m "Hotfix: Actualización automática desde el repo plantilla"
  
  if [ $? -eq 0 ]; then
    # Si no hubo conflictos, empujar a su origin
    git push origin "$BRANCH"
    echo "✅ $REPO actualizado con éxito."
  else
    echo "❌ CONFLICTO EN $REPO. Requiere intervención manual."
  fi
  
  # Limpiar carpeta local
  cd ..
  rm -rf "$REPO"
done

echo "------------------------------------------------"
echo "🎉 Proceso finalizado."

```

### Recomendación para el equipo docente:

1. **Notificar primero:** Siempre es aconsejable avisar a los alumnos antes de correr scripts masivos o pedirles que sincronicen, para que no estén trabajando justo en ese mismo momento.
2. **Modificaciones aisladas:** Procura que las correcciones en el repositorio plantilla sean en archivos que los alumnos no deban modificar (por ejemplo, scripts de tests, configuraciones de CI/CD, o archivos con enunciados/errores de tipografía), así se evitan conflictos al fusionar.