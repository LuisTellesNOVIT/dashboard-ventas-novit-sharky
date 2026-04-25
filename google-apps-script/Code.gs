/**
 * CRM NOVIT / SHARKY — Web App para agregar filas al Google Sheet
 *
 * 1. Abre script.google.com → Nuevo proyecto → pega este código.
 * 2. Ajusta SPREADSHEET_ID si usas otra hoja.
 * 3. Desplegar → Nueva implementación → Tipo: Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 4. Copia la URL /exec y pégala en Mantenimiento CRM del dashboard.
 *
 * La primera fila de la hoja debe ser encabezado. Orden al agregar:
 * Cliente, Estado, Proyecto, Empresa, Setup, Mensualidad, M12, M24, M36
 */
var SPREADSHEET_ID = "1h8Z4pg3axi_VJVWiXAvK22ORSqy86xO_nqOGAR_zAW4";

function doGet(e) {
  var out = { ok: false, error: "unknown" };
  try {
    if (!e || !e.parameter || e.parameter.action !== "append") {
      out.error = "use_action_append";
      return jsonOut_(out);
    }
    var raw = e.parameter.payload;
    if (!raw) {
      out.error = "missing_payload";
      return jsonOut_(out);
    }
    var jsonStr = Utilities.newBlob(Utilities.base64Decode(raw)).getDataAsString("UTF-8");
    var row = JSON.parse(jsonStr);
    appendRow_(row);
    out = { ok: true };
  } catch (err) {
    out = { ok: false, error: String(err.message || err) };
  }
  return jsonOut_(out);
}

function appendRow_(row) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheets()[0];
  sh.appendRow([
    row.cliente || "",
    row.estado || "",
    row.proyecto || "",
    String(row.empresa || "").toUpperCase() === "SHARKY" ? "SHARKY" : "NOVIT",
    Number(row.setup) || 0,
    Number(row.mensualidad) || 0,
    Number(row.m12) || 0,
    Number(row.m24) || 0,
    Number(row.m36) || 0,
  ]);
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
