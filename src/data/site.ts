export const siteInfo = {
  name: "Jowam Coffee Roasters",
  addressLine: "Lavington Mall, James Gichuru Road",
  city: "Nairobi, Kenya",
  mapsQuery: "Jowam Coffee Roasters, Lavington Mall, James Gichuru Road, Nairobi",
  hours: [
    { day: "Monday to Saturday", time: "7:15 am to 7 pm" },
    { day: "Sunday", time: "9 am to 5 pm" },
  ],
  hoursSummary: "Mon to Sat 7:15 am to 7 pm · Sun 9 am to 5 pm",
  // Placeholder contact details: replace with Jowam's real inbox and WhatsApp number (digits only, with country code).
  contact: {
    email: "hello@jowam.example",
    whatsapp: null as string | null,
    isPlaceholder: true,
  },
} as const;

// Where orders get confirmed: WhatsApp once a number is set, email until then.
export const confirmChannel = siteInfo.contact.whatsapp ? "WhatsApp" : "email";
