// Jowam Coffee Roasters: products feed and order log for the website.
//
// One-time setup
// 1. In the Sheet, make two tabs named exactly: Products and Orders.
// 2. Products tab, row 1 headers in this order:
//    Handle, Name, Category, Description, Variant, Price KES, Available, Image, Sort
//    Make Category a dropdown of Coffee, Equipment, Merch.
//    Make Available checkboxes.
// 3. Orders tab, row 1 headers in this order:
//    Received at, Ref, Name, Phone, Email, Method, Address, Items, Subtotal KES, Notes, Status
//    Make Status a dropdown of New, Confirmed, Paid, Fulfilled, Cancelled.
// 4. Open Extensions > Apps Script from this Sheet and paste this file in.
// 5. Project Settings > Script Properties: add SHEET_SECRET, set to the same value
//    as the site's SHEET_SECRET.
// 6. Deploy > New deployment > Web app. Execute as: Me (the owner). Who has access: Anyone.
//    Do this from the Jowam business Google account.
// 7. Updating later: Deploy > Manage deployments, click the pencil, choose New version,
//    then Deploy. Do not create a new deployment, as that changes the web address.

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
  if (!e || !e.postData) return json({ ok: false, error: "no body" });
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "invalid JSON" });
  }
  if (!secretMatches(body.secret)) return json({ ok: false, error: "unauthorized" });
  if (body.action !== "order") return json({ ok: false, error: "unknown action" });
  if (!body.order) return json({ ok: false, error: "no order" });

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
