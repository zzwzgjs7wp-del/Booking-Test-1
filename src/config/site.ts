export const siteConfig = {
  name: "ArcticPro HVAC",
  phone: "(713) 555-0199",
  email: "service@arcticprohvac.com",
  address: {
    street: "1234 Main Street",
    city: "Houston",
    state: "TX",
    zip: "77001",
  },
  serviceArea: "Houston, TX",
  businessHours: {
    weekdays: "Monday - Friday: 7:00 AM - 7:00 PM",
    saturday: "Saturday: 8:00 AM - 5:00 PM",
    sunday: "Sunday: Emergency Service Only",
  },
  social: {
    facebook: "https://facebook.com/arcticprohvac",
    google: "https://g.page/arcticprohvac",
  },
  seo: {
    defaultTitle: "ArcticPro HVAC | Expert AC Repair & Installation in Houston, TX",
    defaultDescription: "Professional HVAC services in Houston, TX. AC repair, installation, heating, and maintenance. Licensed, insured, 5-star rated. Same-day service available.",
  },
} as const;
