export const siteInfo = {
  name: "Jowam Coffee Roasters",
  url: "https://jowamroasters.com",
  addressLine: "Lavington Mall, James Gichuru Road",
  city: "Nairobi, Kenya",
  mapsQuery: "Jowam Coffee Roasters, Lavington Mall, James Gichuru Road, Nairobi",
  hours: [
    { day: "Monday to Saturday", time: "7:15 am to 7 pm" },
    { day: "Sunday", time: "9 am to 5 pm" },
  ],
  // Same hours in schema.org form for structured data.
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:15",
      closes: "19:00",
    },
    { days: ["Sunday"], opens: "09:00", closes: "17:00" },
  ],
  hoursSummary: "Mon to Sat 7:15 am to 7 pm · Sun 9 am to 5 pm",
  // hello@ takes general and experience enquiries; sales@ takes shop orders and wholesale.
  // WhatsApp number: digits only, with country code, or null until there is one.
  contact: {
    hello: "hello@jowamroasters.com",
    sales: "sales@jowamroasters.com",
    whatsapp: null as string | null,
  },
} as const;

// Where orders get confirmed: WhatsApp once a number is set, email until then.
export const confirmChannel = siteInfo.contact.whatsapp ? "WhatsApp" : "email";
