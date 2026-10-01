// Jowam Coffee Roasters: products feed and order log for the website.
// Bound to the Sheet that has the "Products" and "Orders" tabs.
// Set Script Properties > SHEET_SECRET to the same value as the site's SHEET_SECRET.

const PRODUCTS_TAB = "Products";
const ORDERS_TAB = "Orders";

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function secretMatches(value) {
  const expected = PropertiesService.getScriptProperties().getProperty("SHEET_SECRET");
  return Boolean(expected) && value === expected;
}

// Stops a customer-supplied string from being read as a formula in the Sheet.
function asText(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doGet(e) {
  if (!secretMatches(e.parameter.secret)) return json({ ok: false, error: "unauthorized" });
  if (e.parameter.action !== "products") return json({ ok: false, error: "unknown action" });

  const sheet = SpreadsheetApp.getActive().getSheetByName(PRODUCTS_TAB);
  if (!sheet) return json({ ok: false, error: "Products tab not found" });

  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map((h) => String(h).trim());
  const products = values.map((row) =>
    Object.fromEntries(
      headers.map((header, i) => {
        const cell = row[i];
        return [header, cell instanceof Date ? cell.toISOString() : cell];
      }),
    ),
  );
  return json({ ok: true, products: products });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "invalid JSON" });
  }
  if (!secretMatches(body.secret)) return json({ ok: false, error: "unauthorized" });
  if (body.action !== "order") return json({ ok: false, error: "unknown action" });

  const o = body.order;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(ORDERS_TAB);
    if (!sheet) return json({ ok: false, error: "Orders tab not found" });
    sheet.appendRow([
      Utilities.formatDate(new Date(), "Africa/Nairobi", "yyyy-MM-dd HH:mm"),
      asText(o.ref),
      asText(o.name),
      "'" + o.phone, // keep the leading 254 as text
      asText(o.email),
      asText(o.method),
      asText(o.address),
      asText(o.items),
      o.subtotalKes,
      asText(o.notes),
      "New",
    ]);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}
