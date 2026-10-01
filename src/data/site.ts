export const siteInfo = {
  name: "Jowam Coffee Roasters",
  addressLine: "Lavington Mall, James Gichuru Road",
  city: "Nairobi, Kenya",
  mapsQuery: "Jowam Coffee Roasters, Lavington Mall, James Gichuru Road, Nairobi",
  hours: [
    { day: "Mon–Sat", time: "7:15 am – 7:00 pm" },
    { day: "Sun", time: "9:00 am – 5:00 pm" },
  ],
  hoursSummary: "Mon–Sat 7:15 am – 7 pm · Sun 9 am – 5 pm",
  // Placeholder contact details — replace with Jowam's real inbox and WhatsApp number (digits only, with country code).
  contact: {
    email: "hello@jowam.example",
    whatsapp: null as string | null,
    isPlaceholder: true,
  },
} as const;
