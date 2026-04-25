# Apps Script — altas al Google Sheet desde el dashboard

El HTML del CRM **lee** la hoja en el navegador (API de visualización de Google). Para **escribir** filas sin servidor propio hace falta esta mini API en Google Apps Script.

## Pasos

1. En [script.google.com](https://script.google.com) crea un proyecto y pega el contenido de `Code.gs`.
2. En la línea `SPREADSHEET_ID`, verifica que sea el ID de tu hoja (el que está entre `/d/` y `/edit` en la URL).
3. **Desplegar** → **Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquiera** (o restringe si tu organización lo permite)
4. Copia la URL que termina en `/exec`.
5. En el dashboard, **Mantenimiento CRM** → sección *URL de Apps Script* → pega y **Guardar**.

## Hoja

- Primera fila: encabezados reconocibles, por ejemplo: **Cliente**, **Estado**, **Proyecto**, **Empresa**, **Setup**, **Mensualidad**, **M12**, **M24**, **M36** (los nombres pueden variar un poco; el lector del dashboard hace coincidencia flexible).
- Las filas nuevas se agregan **al final** con el orden de columnas indicado en los comentarios de `Code.gs`. Si tu hoja tiene otro orden, adapta `appendRow_` en el script.

## Seguridad

Cualquiera con la URL `/exec` podría enviar filas si el despliegue es “Cualquiera”. Valora restringir acceso o añadir un token secreto en el script y en el dashboard si el riesgo lo exige.
