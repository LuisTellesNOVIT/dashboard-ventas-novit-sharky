# Dashboard de Ventas — NOVIT / SHARKY

Dashboard comercial protegido con encriptación AES-256-GCM del lado del cliente.
El acceso requiere contraseña — solicítala al administrador.

**URL de acceso:** [https://luistellesnovit.github.io/dashboard-ventas-novit-sharky/](https://luistellesnovit.github.io/dashboard-ventas-novit-sharky/)

> El acceso es **únicamente** por `index.html` cifrado. La versión `dashboard_ventas.html` ya no se publica porque contiene el `APPS_SCRIPT_TOKEN` que protege la lectura del Google Sheet privado. Mantén ese archivo solo en tu carpeta local de trabajo (`CRM/`).

## Lectura del Google Sheet privado

El dashboard lee/escribe vía Apps Script (carpeta `google-apps-script/`). El sheet permanece privado; el Apps Script corre con tus credenciales y valida un `ACCESS_TOKEN` en cada request. El mismo valor debe estar en `Code.gs` (servidor) y como `APPS_SCRIPT_TOKEN` en `dashboard_ventas.html` (cliente).

## Publicar actualizaciones en GitHub (GitHub Pages)

1. En la carpeta **padre** del repo (`…/CRM`), regenera el `index.html` cifrado a partir de `dashboard_ventas.html` y el template de login:
   ```bash
   node encrypt.js "TU_CONTRASEÑA" dashboard_ventas.html login_template.html index.html
   ```
2. Copia el `index.html` generado a esta carpeta `deploy/` y sube los cambios:
   ```bash
   cp index.html deploy/index.html
   cd deploy
   git add index.html && git commit -m "Actualiza dashboard cifrado" && git push origin main
   ```
3. En unos minutos GitHub Pages mostrará la nueva versión.

*Autenticación:* usa [HTTPS con credencial de GitHub](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git) o `gh auth login`; no subas tokens en la URL del remoto `origin`.
