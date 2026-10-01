# Jowam website: products and orders

Everything the shop shows comes from one Google Sheet. Orders placed on the website land in the same Sheet. You never need to touch code.

## The Products tab

Each row is one thing a customer can buy, such as a size or grind. Rows with the same Handle belong to one product.

| Column      | What to put in it                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| Handle      | The product's web address, lowercase with hyphens, e.g. `kiambu-aa`. Never change it once the product is live. |
| Name        | The product name. Only needed on the product's first row.                                                      |
| Category    | Pick Coffee, Equipment or Merch. First row only.                                                               |
| Description | Tasting notes or a short story. First row only.                                                                |
| Variant     | The option, e.g. `250g Whole Bean`.                                                                            |
| Price KES   | Whole shillings, no currency sign.                                                                             |
| Available   | Tick when it can be ordered. Untick when it sells out.                                                         |
| Image       | A Google Drive link to the photo. First row only.                                                              |
| Sort        | Lower numbers show first in the shop.                                                                          |

### Add a product

1. Add a row with every column filled in.
2. Tick Available.
3. Wait up to 5 minutes, then refresh the shop. Any change to the Sheet takes up to 5 minutes to show.

### Add another size or grind

Add a new row with the same Handle, then fill in Variant, Price KES and Available. Leave Name, Category, Description and Image empty.

### Change a price or mark something sold out

Edit Price KES, or untick Available. If every row of a product is unticked, the product disappears from the shop.

### Add a photo

1. Upload the photo to the shared "Website product photos" folder in Drive.
2. Right click it, choose Share, and set General access to "Anyone with the link".
3. Copy the link and paste it into the Image column on the product's first row.

Portrait photos (4:5) look best.

### Please don't

- Rename the tabs or change the header row.
- Change a Handle on a live product. It breaks old links and customers' bags.
- Type currency signs or commas into Price KES.

If a row has a mistake, the shop skips that row and keeps showing everything else. A mistake on a product's first row hides the whole product until it is fixed.

## The Orders tab

The website adds a row for every order. The customer's WhatsApp message carries the same order number, for example `JW-261001-4F7K`, so you can match them.

Move the Status column along as you go:

- **New**: just arrived
- **Confirmed**: delivery fee and timing agreed on WhatsApp
- **Paid**: M-Pesa code checked, or paid at pickup
- **Fulfilled**: collected or delivered
- **Cancelled**: not going ahead

Don't edit the other columns. They are the record of what the customer ordered.

## Changing the script (admin only)

The Sheet's Apps Script is what the website talks to. After editing it, open Deploy, then Manage deployments, click the pencil on the existing deployment, choose "New version" and Deploy. Do not use "New deployment", because that gives a new web address and the site keeps using the old one.

## Setting up the Sheet (admin only)

The full setup steps are in the notes at the top of the Apps Script file. In short, the Sheet needs two tabs, named exactly `Products` and `Orders`, each with this header row in row 1:

- **Products**: Handle, Name, Category, Description, Variant, Price KES, Available, Image, Sort. Category is a dropdown of Coffee, Equipment and Merch. Available is a tick box.
- **Orders**: Received at, Ref, Name, Phone, Email, Method, Address, Items, Subtotal KES, Notes, Status. Status is a dropdown of New, Confirmed, Paid, Fulfilled and Cancelled.
