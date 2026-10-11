import { siteInfo } from "@/data/site";

// Bump LEGAL_UPDATED whenever a policy changes in substance. Orders record the version accepted.
export const LEGAL_UPDATED = "2026-10-11";
export const LEGAL_UPDATED_LABEL = "11 October 2026";

const { hello, sales, phone } = siteInfo.contact;
const address = `${siteInfo.addressLine}, ${siteInfo.city}`;

export type LegalBlock = string | { list: readonly string[] };
export type LegalSection = { id: string; heading: string; body: readonly LegalBlock[] };
export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  sections: readonly LegalSection[];
};

const contactLine = `Email ${hello}, call or WhatsApp ${phone}, or visit us at ${address}.`;

const governingLaw: LegalSection = {
  id: "law",
  heading: "Governing law",
  body: [
    "These terms are governed by the laws of Kenya, and the courts of Kenya have jurisdiction over any dispute about them. If you are a consumer, nothing here stops you from using the Small Claims Court or any other forum the law gives you.",
  ],
};

const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Sale",
  description:
    "The terms that apply when you buy coffee and other products from Jowam Coffee Roasters through our website, WhatsApp or email.",
  summary:
    "These terms cover what happens when you order from us: how an order is confirmed, how you pay, what you can expect from us and what we expect from you. They apply together with our Delivery Policy, Refund and Returns Policy and Privacy Policy.",
  sections: [
    {
      id: "about",
      heading: "About these terms",
      body: [
        `These terms apply to every order you place with ${siteInfo.name} ("Jowam", "we", "us") through ${siteInfo.url}, and to orders placed by WhatsApp, email or phone. They also cover your use of the website.`,
        "When you tick the box on the order form, you confirm that you have read and accept these terms, the Delivery Policy and the Refund and Returns Policy, and that you have read the Privacy Policy. The version in force on the day you place your order is the one that applies to it.",
        "Wholesale accounts and bookings for cupping, barista training or private events have their own terms, which apply on top of these.",
      ],
    },
    {
      id: "who-we-are",
      heading: "Who we are",
      body: [`${siteInfo.name} is a café and coffee roastery at ${address}. ${contactLine}`],
    },
    {
      id: "ordering",
      heading: "Who can order",
      body: [
        "You must be 18 or older to place an order, or have a parent or guardian place it for you. The name, phone number, email and address you give us must be your own or ones you are allowed to use, and they must be accurate. We rely on them to confirm, deliver and support your order.",
      ],
    },
    {
      id: "contract",
      heading: "How your order becomes a contract",
      body: [
        "Placing an order on the website is an offer to buy. The order reference and confirmation email you receive tell you we have your order. They do not yet mean we have accepted it.",
        `We accept your order when we contact you by ${siteInfo.contact.whatsapp ? "WhatsApp or email" : "email"} to confirm the items, the delivery fee and the total, and you pay. At that point a binding contract exists between us.`,
        "We may decline an order, for example when an item is out of stock, a price was shown in error, we cannot deliver to your area, or we have reason to believe the order is not genuine. If you have already paid for an order we decline, we refund you in full.",
      ],
    },
    {
      id: "prices",
      heading: "Prices and payment",
      body: [
        "All prices are in Kenya shillings and include any VAT that applies. Delivery is charged separately. We tell you the delivery fee before you pay, and you never pay more than the total we confirm with you.",
        "If a price on the website is wrong, we will tell you the correct price before you pay. You can then go ahead at the correct price or cancel at no cost.",
        "We take payment by M-Pesa to the Paybill or Till number we give you when we confirm your order. Please keep these points in mind:",
        {
          list: [
            "Only pay to a number we send you from our official WhatsApp or email.",
            "Check that the M-Pesa confirmation shows Jowam as the recipient before you enter your PIN.",
            "We will never ask for your M-Pesa PIN, a reversal, or payment to a personal number.",
          ],
        },
        "If an order is not paid within 48 hours of our confirmation, we may cancel it. We give you a receipt for every paid order, and a tax invoice on request.",
      ],
    },
    {
      id: "products",
      heading: "Our products",
      body: [
        "Coffee is a natural product. Taste, colour and roast can vary a little between harvests and batches, and the tasting notes we give are a guide rather than a promise. Photos show what the product usually looks like, and packaging can change.",
        "Bag weights are measured at packing. Coffee tastes best within a few weeks of roasting, so store it sealed, away from heat, light and moisture.",
        "Products are available while stock lasts. If something you ordered runs out before we confirm, we will offer you an alternative or remove it from the order.",
      ],
    },
    {
      id: "cancelling",
      heading: "Cancelling an order",
      body: [
        "You can cancel at no cost at any time before we dispatch your order or hand it over for pickup. If you have paid, we refund you in full.",
        "Once we have ground coffee to your instructions, that coffee cannot be cancelled unless it is faulty, because we cannot sell it to anyone else. After dispatch, our Refund and Returns Policy applies.",
        "If we did not give you the information the Consumer Protection Act, 2012 requires for a remote sale, you may cancel within the time that Act allows.",
      ],
    },
    {
      id: "rights",
      heading: "Your legal rights",
      body: [
        "Under the Sale of Goods Act and the Consumer Protection Act, 2012, the goods we sell you must match their description, be of good quality and be fit for their purpose. Nothing in these terms takes away or limits those rights.",
      ],
    },
    {
      id: "liability",
      heading: "Our responsibility to you",
      body: [
        "If we break these terms or act negligently, we are responsible for loss you suffer that was a foreseeable result. We are not responsible for loss that was not foreseeable, or for loss of profit or business opportunity, because our retail products are sold for personal use.",
        "Apart from that, our total responsibility for any order is limited to the amount you paid for it, including delivery. This limit does not apply to death or personal injury caused by our negligence, to fraud, or to anything else the law does not allow us to limit.",
      ],
    },
    {
      id: "events",
      heading: "Events outside our control",
      body: [
        "We are not responsible for delays or failures caused by events we cannot reasonably control, such as power or network outages, M-Pesa downtime, fuel shortages, floods, road closures, strikes or public unrest. We will tell you as soon as we can and agree a new time with you, or refund you for anything we cannot supply.",
      ],
    },
    {
      id: "website",
      heading: "Using our website",
      body: [
        "The text, photos, logos and design on this website belong to Jowam or are used with permission. You may view and share them for personal, non-commercial use. Please do not copy them for commercial use without asking us first.",
        "You must not use the website to place false orders, send spam, collect other people's data, or interfere with how the site works. We may block access or cancel orders where we see this.",
        "We work to keep the website available and accurate, but we cannot promise it will always be free of errors or interruptions. Links to other websites, such as Google Maps, Instagram or TikTok, are there for convenience, and those sites have their own terms.",
      ],
    },
    {
      id: "communications",
      heading: "Messages and records",
      body: [
        "You agree that order confirmations, receipts and other notices may be sent to you by WhatsApp or email, and that they count as written notice. Electronic records are recognised under the Kenya Information and Communications Act.",
      ],
    },
    {
      id: "complaints",
      heading: "Complaints",
      body: [
        `If something goes wrong, tell us first. ${contactLine} Please include your order reference. We acknowledge complaints within 2 working days and aim to resolve them within 14 days.`,
        "If we cannot resolve a complaint between us, you can contact the Competition Authority of Kenya, which handles consumer complaints, or take the matter to the Small Claims Court.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: [
        "We may update these terms from time to time, for example when the law or our service changes. The date at the top of this page shows the latest version. Changes do not affect orders already placed.",
      ],
    },
    governingLaw,
    {
      id: "general",
      heading: "General",
      body: [
        "If a court finds any part of these terms invalid, the rest still applies. If we do not enforce a right straight away, we can still enforce it later. These terms, together with the policies they refer to, are the whole agreement between us about your order.",
      ],
    },
  ],
};

const delivery: LegalDoc = {
  slug: "delivery",
  title: "Delivery Policy",
  description:
    "Pickup, delivery areas, fees, timing and what happens if a delivery goes wrong when you order from Jowam Coffee Roasters.",
  summary:
    "You can collect your order from the café or have it delivered anywhere in Kenya. This page explains how fees are set, how long it takes and what to do if a delivery goes wrong.",
  sections: [
    {
      id: "options",
      heading: "Pickup and delivery options",
      body: [
        {
          list: [
            `Pickup from the café at ${address}, during opening hours (${siteInfo.hoursSummary}).`,
            "Delivery within Nairobi by rider.",
            "Delivery outside Nairobi by courier or a bus parcel service to the nearest town or office.",
          ],
        },
        "We do not ship outside Kenya at the moment.",
      ],
    },
    {
      id: "fees",
      heading: "Delivery fees",
      body: [
        "The delivery fee depends on where you are and the size of the order. We tell you the exact fee when we confirm your order, and you pay it together with the order. Pickup is free.",
      ],
    },
    {
      id: "timing",
      heading: "How long it takes",
      body: [
        "We usually dispatch paid orders within 1 to 2 working days, as we pack coffee close to roasting. After dispatch, Nairobi deliveries usually arrive the same or next day, and deliveries outside Nairobi usually take 1 to 3 working days, depending on the courier.",
        "These are estimates. We will tell you if your order is going to be late. If it arrives more than 7 days after the date we gave you, you can cancel and we will refund what you paid for anything not yet delivered.",
      ],
    },
    {
      id: "pickup",
      heading: "Collecting your order",
      body: [
        "We will tell you when your order is ready. Bring your order reference. Someone else can collect for you if they give us the reference and your name.",
        "We hold orders for 14 days. If an order is not collected in that time and we cannot reach you, we may cancel it and refund your payment less any costs we have already incurred, such as grinding to order.",
      ],
    },
    {
      id: "receiving",
      heading: "Receiving a delivery",
      body: [
        "Please give a full address with a landmark, and make sure someone is available on the phone number you gave us. Our rider may ask for your order reference before handing over.",
        "If we cannot reach you after two attempts, the order comes back to the café and we will arrange a new delivery with you. A second delivery fee may apply. The same applies if the address you gave was wrong or incomplete.",
        "For deliveries outside Nairobi, we send you the courier's waybill or tracking details. Please collect the parcel within the courier's collection period, as some couriers charge for storage.",
      ],
    },
    {
      id: "risk",
      heading: "Damage or loss in transit",
      body: [
        "The order is our responsibility until it reaches you or you collect it. Please check it when it arrives. If anything is damaged, missing or wrong, tell us within 48 hours with your order reference and a photo, and we will replace it or refund you in line with our Refund and Returns Policy.",
        "Ownership of the goods passes to you once you have paid and the order has been delivered or collected.",
      ],
    },
  ],
};

const refunds: LegalDoc = {
  slug: "refunds",
  title: "Refund and Returns Policy",
  description:
    "How returns, replacements and refunds work for coffee and products bought from Jowam Coffee Roasters.",
  summary:
    "Coffee is a food product, so we cannot take back opened bags for a change of mind. If anything arrives wrong, damaged or not up to standard, we will put it right.",
  sections: [
    {
      id: "problems",
      heading: "Wrong, damaged or faulty items",
      body: [
        "Tell us within 48 hours of delivery if an item is wrong, damaged or missing, and within 7 days if you find a quality problem once you open it. Send your order reference, a short description and a photo where you can.",
        "We will offer you a replacement or a full refund for the affected item, including any delivery fee you paid for it. We may ask you to return the item or keep it aside so we can collect it, at our cost.",
      ],
    },
    {
      id: "change-of-mind",
      heading: "Changing your mind",
      body: [
        "You can return unopened bags in their original sealed packaging within 7 days of delivery or collection. Bring or send them to the café at your own cost. We will exchange them or refund the price of the items, but not the original delivery fee.",
        "We cannot accept change-of-mind returns for:",
        {
          list: [
            "Bags that have been opened or whose seal is broken.",
            "Coffee ground to your instructions.",
            "Items damaged after delivery, or not stored as advised.",
            "Food and drinks bought at the café. If something is not right with your meal or drink, please tell the team straight away so we can fix it.",
          ],
        },
      ],
    },
    {
      id: "cancellations",
      heading: "Cancelled orders",
      body: [
        "If you cancel before we dispatch, or we decline or cannot complete an order, we refund everything you paid.",
      ],
    },
    {
      id: "how",
      heading: "How refunds are paid",
      body: [
        "We refund to the M-Pesa number that paid for the order, or by bank transfer for wholesale accounts. Refunds are made within 7 working days of approval, and we cover any transfer charges.",
      ],
    },
    {
      id: "rights",
      heading: "Your legal rights",
      body: [
        "This policy is in addition to your rights under the Sale of Goods Act and the Consumer Protection Act, 2012. It does not reduce them.",
        `To start a return or refund, ${contactLine.charAt(0).toLowerCase()}${contactLine.slice(1)}`,
      ],
    },
  ],
};

const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  description:
    "How Jowam Coffee Roasters collects, uses, shares and protects your personal data under the Kenya Data Protection Act, 2019.",
  summary:
    "This policy explains what personal data we collect when you order, enquire or browse our website, why we need it, who we share it with and the rights you have under the Data Protection Act, 2019.",
  sections: [
    {
      id: "controller",
      heading: "Who is responsible for your data",
      body: [
        `${siteInfo.name} is the data controller for personal data collected through ${siteInfo.url}, our WhatsApp and email, and at the café. We handle it in line with the Data Protection Act, 2019 and its regulations.`,
        `For any privacy question or request, email ${hello} with "Privacy" in the subject line, or write to us at ${address}.`,
      ],
    },
    {
      id: "collect",
      heading: "What we collect",
      body: [
        {
          list: [
            "Orders: your name, phone number, email, delivery address, the items you order, any notes you add, and your order reference.",
            "Payments: the M-Pesa transaction code, the paying name and number, and the amount. We never see or store your M-Pesa PIN.",
            "Enquiries for wholesale, cupping, training or events: your name, business name, email, phone, location and the details you give us.",
            "Messages you send us by WhatsApp, email, phone, Instagram or TikTok.",
            "Technical data: your IP address, browser type and the pages you request. Our hosting provider processes this to deliver the site, keep it secure and limit abuse.",
          ],
        },
        "If you tell us about an allergy or health need in an order note or booking, that is sensitive personal data. By giving it to us, you consent to us using it only to prepare your order or event safely. You can ask us to delete it at any time.",
        "Our website is not aimed at children. We do not knowingly collect data from anyone under 18 without a parent or guardian's consent.",
      ],
    },
    {
      id: "use",
      heading: "Why we use it and on what basis",
      body: [
        {
          list: [
            "To confirm, prepare, deliver and support your order. We need this to perform our contract with you.",
            "To reply to enquiries and run bookings, which is in our legitimate interest and yours.",
            "To keep the website and our accounts secure and to prevent fraud, which is in our legitimate interest.",
            "To keep sales and tax records, which the law requires.",
            "To send you news or offers, only if you have asked us to. You can opt out at any time.",
          ],
        },
        "We do not make decisions about you by automated means alone, and we do not sell your personal data.",
      ],
    },
    {
      id: "share",
      heading: "Who we share it with",
      body: [
        "We share only what each party needs to do its job:",
        {
          list: [
            "Google, which stores our order records in Google Sheets.",
            "Resend, which sends order and enquiry emails for us.",
            "Cloudflare, which hosts and protects our website.",
            "Safaricom, which processes M-Pesa payments.",
            "Meta, which runs WhatsApp, when you message us there.",
            "Riders and couriers, who receive your name, phone number and delivery address only.",
            "Government bodies or courts, where the law requires us to.",
          ],
        },
        "Our Visit page shows a Google Maps embed, and the site loads fonts from Google Fonts. Your browser connects to Google directly for these, so Google receives your IP address and may set its own cookies. Google's privacy policy applies to that data.",
      ],
    },
    {
      id: "transfers",
      heading: "Data stored outside Kenya",
      body: [
        "Some of these providers store data on servers outside Kenya, including in the United States and the European Union. We only use providers that commit to protecting personal data, and we transfer data abroad only as the Data Protection Act allows, for example where it is needed to fulfil your order or where suitable safeguards are in place.",
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      body: [
        {
          list: [
            "Order and payment records: 5 years after the order, as required for tax purposes.",
            "Enquiries that do not lead to an order or booking: up to 12 months.",
            "WhatsApp and email conversations: up to 12 months, unless they form part of an order record.",
            "Technical logs: kept by our hosting provider for a short period, usually days.",
          ],
        },
        "After that, we delete the data or anonymise it so it no longer identifies you.",
      ],
    },
    {
      id: "security",
      heading: "How we protect it",
      body: [
        "Our website uses HTTPS. Access to order records and our email and WhatsApp accounts is limited to the staff who need it, using protected accounts. If a breach puts your data at real risk, we will notify the Office of the Data Protection Commissioner within 72 hours and tell you without undue delay.",
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      body: [
        "Under the Data Protection Act, 2019 you have the right to:",
        {
          list: [
            "Be told how your data is used, which is what this policy does.",
            "Get a copy of the personal data we hold about you.",
            "Have wrong or incomplete data corrected.",
            "Have data deleted when we no longer need it or hold it unlawfully.",
            "Object to, or ask us to restrict, how we use your data.",
            "Receive your data in a portable format.",
            "Withdraw consent you have given, such as for marketing.",
          ],
        },
        `To use any of these rights, email ${hello}. We may ask you to confirm your identity. There is no charge, and we reply within the time limits set by the Data Protection (General) Regulations, 2021.`,
        "If you are not happy with how we handle your data, you can complain to the Office of the Data Protection Commissioner at www.odpc.go.ke. We would appreciate the chance to sort it out with you first.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and browser storage",
      body: [
        "We do not use advertising or analytics cookies. Your shopping bag is saved in your browser's local storage so it is still there when you come back. It stays on your device and only reaches us when you place an order. You can clear it at any time in your browser settings.",
        "Third-party content such as the Google Maps embed may set its own cookies, as explained above. If we ever add analytics or advertising tools, we will update this policy and ask for your consent where the law requires it.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: [
        "We will update this page when our practices or the law change. The date at the top shows the current version. If a change affects how we use data you have already given us, we will let you know.",
      ],
    },
  ],
};

const wholesaleTerms: LegalDoc = {
  slug: "wholesale-terms",
  title: "Wholesale Terms",
  description:
    "Trading terms for cafés, restaurants, hotels and offices buying roasted coffee wholesale from Jowam Coffee Roasters.",
  summary:
    "These terms apply to businesses that buy coffee from us to serve or resell. A signed supply agreement, where we have one, takes priority over anything here.",
  sections: [
    {
      id: "scope",
      heading: "Who these terms are for",
      body: [
        "These terms apply to businesses buying from Jowam for use or resale in the course of their business. Our Terms of Sale also apply, except where these terms say something different. If we sign a separate supply agreement with you, that agreement takes priority.",
      ],
    },
    {
      id: "account",
      heading: "Opening an account",
      body: [
        "To open an account we need your registered business name, KRA PIN, delivery address and an authorised contact person. Orders from that contact, or anyone you name in writing, bind your business.",
      ],
    },
    {
      id: "orders",
      heading: "Orders and minimums",
      body: [
        `The minimum order is 5 kg. Send orders to ${sales} or by WhatsApp. An order is accepted once we confirm it in writing.`,
        "We roast to order, so please allow at least 3 working days between order and delivery. Standing orders on a fixed schedule are welcome.",
      ],
    },
    {
      id: "prices",
      heading: "Prices",
      body: [
        "Prices are as set out in your quote or our current wholesale price list and are exclusive of VAT, which we add where it applies. Quotes are valid for 14 days.",
        "Green coffee prices and exchange rates move, so we may change wholesale prices. We give you at least 14 days' written notice of any increase, and orders we have already confirmed keep their price.",
      ],
    },
    {
      id: "payment",
      heading: "Payment",
      body: [
        "New accounts pay before dispatch by M-Pesa or bank transfer. Credit terms are available only if we agree them in writing. Where they apply, invoices are due within the agreed period, which is 30 days from the invoice date unless stated otherwise.",
        "If an invoice is overdue, we may hold further deliveries until it is paid, and recover reasonable costs of collecting the debt. We issue tax invoices for all wholesale sales.",
      ],
    },
    {
      id: "delivery",
      heading: "Delivery and checking your order",
      body: [
        "Please check deliveries on arrival. Report any shortage or damage within 2 working days, and any quality concern within 7 days, quoting the roast date or batch on the bag. We will replace or credit anything that does not meet our standard.",
        "Risk passes to you on delivery. The coffee remains our property until it has been paid for in full.",
      ],
    },
    {
      id: "use",
      heading: "Storage, preparation and our brand",
      body: [
        "Coffee quality depends on storage, equipment and preparation as well as roasting. We are not responsible for problems caused by poor storage, faulty equipment or preparation outside our control. We are happy to advise and train your team.",
        "You may say that you serve Jowam coffee and use our name and logo for that purpose, following any guidelines we give you. You may not repackage our coffee or sell it under another name unless we agree in writing.",
      ],
    },
    {
      id: "liability",
      heading: "Liability",
      body: [
        "Our total liability for any order is limited to the price of that order. We are not liable for loss of profit, loss of business or any indirect loss. Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything the law does not allow us to limit.",
      ],
    },
    {
      id: "ending",
      heading: "Ending supply",
      body: [
        "Either of us can end a supply arrangement with 14 days' written notice. We may end it sooner if invoices remain unpaid after a written reminder. Any amounts owed become due when supply ends.",
        "Please keep our wholesale prices and terms confidential.",
      ],
    },
    {
      id: "disputes",
      heading: "Disputes",
      body: [
        "If a dispute comes up, we will first try to settle it through good faith discussion between the people responsible on each side. If that does not work within 14 days, either of us may refer it to mediation, and after that to the courts of Kenya. These terms are governed by the laws of Kenya.",
      ],
    },
  ],
};

const bookingTerms: LegalDoc = {
  slug: "booking-terms",
  title: "Booking Terms",
  description:
    "Booking, payment and cancellation terms for cupping sessions, barista training and private events at Jowam Coffee Roasters.",
  summary:
    "These terms apply when you book a cupping session, barista training or a private or team event with us. They cover payment, cancellations, safety and what to expect on the day.",
  sections: [
    {
      id: "booking",
      heading: "Making a booking",
      body: [
        "Sending an enquiry does not reserve a place. Your booking is confirmed once we confirm it in writing and receive payment or the deposit we ask for.",
      ],
    },
    {
      id: "payment",
      heading: "Prices and payment",
      body: [
        "We confirm the price when you book. Public cupping sessions and barista training are paid in full to secure your place.",
        "Private and team events need a deposit to hold the date. We tell you the amount when we confirm. The balance is due on or before the day, as agreed, and is based on your final guest numbers. Please give us final numbers at least 72 hours before the event.",
      ],
    },
    {
      id: "cancel-you",
      heading: "If you need to cancel",
      body: [
        {
          list: [
            "Cupping and training, 7 or more days before: full refund, or move to another date.",
            "Cupping and training, 2 to 6 days before: move to another date once at no cost, or a 50% refund.",
            "Cupping and training, less than 48 hours before or no-show: no refund, but you can send someone in your place if you tell us beforehand.",
            "Private events, 14 or more days before: deposit refunded in full.",
            "Private events, less than 14 days before: the deposit is kept to cover preparation and food already bought.",
          ],
        },
      ],
    },
    {
      id: "cancel-us",
      heading: "If we need to cancel or change",
      body: [
        "If we cancel or need to move your booking, you can choose a new date or a full refund. We may change the coffees or the person leading a session, but the session will be of the same standard.",
      ],
    },
    {
      id: "day",
      heading: "On the day",
      body: [
        "Please arrive on time. Sessions start as scheduled, and late arrivals may miss part of the session without a refund.",
        "Coffee work involves hot water, steam, grinders and the roaster. Follow the team's instructions at all times. Tell us in advance about allergies or medical conditions we should know about. Participants under 18 need a parent or guardian's consent and must be supervised.",
        "Personal belongings are your responsibility. For private events, the person who books is responsible for guests' conduct and for any damage beyond normal wear.",
      ],
    },
    {
      id: "certificates",
      heading: "Training certificates",
      body: [
        "Barista training ends with a Jowam certificate of attendance. It shows the skills covered in our course and is not a national or accredited qualification unless we state otherwise in writing.",
      ],
    },
    {
      id: "photos",
      heading: "Photos",
      body: [
        "We sometimes take photos at sessions and events for our social media. We will ask before posting anyone in a way that identifies them, and you can tell the team at any time if you would rather not be photographed.",
      ],
    },
    governingLaw,
  ],
};

export const legalDocs = [terms, delivery, refunds, privacy, wholesaleTerms, bookingTerms] as const;

export const legalDocBySlug = (slug: string) => legalDocs.find((doc) => doc.slug === slug);

export const legalPath = (slug: string) => `/legal/${slug}`;
