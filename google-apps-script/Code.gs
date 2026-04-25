/**
 * CRM NOVIT / SHARKY — Web App para leer y escribir filas en el Google Sheet.
 *
 * El sheet puede mantenerse PRIVADO. Apps Script corre como TÚ y accede al sheet
 * con tus permisos. El cliente del dashboard se autentica con un TOKEN secreto
 * que se valida en cada request.
 *
 * 1. Abre script.google.com → Nuevo proyecto → pega este código.
 * 2. Verifica SPREADSHEET_ID.
 * 3. **IMPORTANTE:** reemplaza ACCESS_TOKEN por un valor único y secreto.
 *    El mismo valor debe estar en el dashboard (constante APPS_SCRIPT_TOKEN).
 * 4. Desplegar → Nueva implementación → Tipo: Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 5. Copia la URL /exec y pégala en Mantenimiento CRM del dashboard.
 *
 * Endpoints (todos requieren ?token=ACCESS_TOKEN):
 *   GET  ?action=read                 → { ok, headers, rows }
 *   GET  ?action=append&payload=BASE64({cliente, estado, ...})  → { ok }
 */
var SPREADSHEET_ID = "1h8Z4pg3axi_VJVWiXAvK22ORSqy86xO_nqOGAR_zAW4";
var ACCESS_TOKEN = "eeed779a9a605e71f06316257b699ca57c8ea3874dedc69039862867b10c38ff";

function doGet(e) {
  var out = { ok: false, error: "unknown" };
  try {
    if (!e || !e.parameter) {
      out.error = "missing_params";
      return jsonOut_(out);
    }
    if (e.parameter.token !== ACCESS_TOKEN) {
      out.error = "invalid_token";
      return jsonOut_(out);
    }
    var action = e.parameter.action;
    if (action === "read") {
      var data = readSheet_();
      out = { ok: true, headers: data.headers, rows: data.rows };
    } else if (action === "append") {
      var raw = e.parameter.payload;
      if (!raw) {
        out.error = "missing_payload";
        return jsonOut_(out);
      }
      var jsonStr = Utilities.newBlob(Utilities.base64Decode(raw)).getDataAsString("UTF-8");
      var row = JSON.parse(jsonStr);
      appendRow_(row);
      out = { ok: true };
    } else {
      out.error = "use_action_read_or_append";
    }
  } catch (err) {
    out = { ok: false, error: String(err.message || err) };
  }
  return jsonOut_(out);
}

function readSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheets()[0];
  var values = sh.getDataRange().getValues();
  if (values.length === 0) return { headers: [], rows: [] };
  var headers = values[0].map(function(h) { return String(h == null ? "" : h).trim(); });
  var rows = values.slice(1);
  return { headers: headers, rows: rows };
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
