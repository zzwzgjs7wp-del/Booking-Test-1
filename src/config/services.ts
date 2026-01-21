import { Wrench, Snowflake, Flame, Settings, Wind, Gauge } from "lucide-react";

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  benefits: string[];
}

export const services: Service[] = [
  {
    slug: "ac-repair",
    title: "AC Repair",
    shortDescription: "Fast, reliable air conditioning repair services to keep you cool when you need it most.",
    fullDescription: "When your AC breaks down, you need fast, reliable service. Our certified technicians provide same-day AC repair services throughout Houston. We diagnose and fix all makes and models, from minor issues to major repairs. With transparent pricing and a 100% satisfaction guarantee, we'll get your cooling system running efficiently again.",
    icon: Snowflake,
    features: [
      "Same-day service available",
      "All makes and models",
      "Transparent pricing",
      "100% satisfaction guarantee",
      "Emergency repairs 24/7",
    ],
    benefits: [
      "Restore comfort quickly",
      "Extend AC lifespan",
      "Lower energy bills",
      "Prevent costly breakdowns",
    ],
  },
  {
    slug: "ac-installation",
    title: "AC Installation",
    shortDescription: "Professional AC installation with energy-efficient systems and expert sizing.",
    fullDescription: "Upgrade to a new, energy-efficient air conditioning system with our professional installation services. We help you choose the perfect unit for your home, ensuring proper sizing and optimal performance. Our installation process includes proper ductwork assessment, electrical connections, and system testing. All installations come with a comprehensive warranty and ongoing support.",
    icon: Snowflake,
    features: [
      "Free estimates",
      "Energy-efficient systems",
      "Proper sizing & load calculations",
      "Professional installation",
      "Comprehensive warranty",
    ],
    benefits: [
      "Lower energy costs",
      "Improved comfort",
      "Increased home value",
      "Peace of mind",
    ],
  },
  {
    slug: "heating",
    title: "Heating Services",
    shortDescription: "Expert heating repair, installation, and maintenance to keep you warm all winter.",
    fullDescription: "Stay warm and comfortable all winter with our comprehensive heating services. Whether you need furnace repair, heat pump installation, or boiler maintenance, our experienced technicians have you covered. We service all heating system types and provide emergency repairs when you need them most. Trust us to keep your home cozy and your energy bills low.",
    icon: Flame,
    features: [
      "Furnace repair & replacement",
      "Heat pump services",
      "Boiler maintenance",
      "Emergency heating repairs",
      "Energy-efficient upgrades",
    ],
    benefits: [
      "Reliable winter comfort",
      "Lower heating costs",
      "Extended system life",
      "Safe operation",
    ],
  },
  {
    slug: "maintenance",
    title: "HVAC Maintenance",
    shortDescription: "Preventive maintenance plans to keep your system running efficiently year-round.",
    fullDescription: "Regular maintenance is the key to keeping your HVAC system running efficiently and avoiding costly breakdowns. Our comprehensive maintenance plans include seasonal tune-ups, filter replacements, system cleaning, and performance checks. We'll catch small issues before they become big problems, saving you money and ensuring your comfort year-round.",
    icon: Settings,
    features: [
      "Seasonal tune-ups",
      "Filter replacements",
      "System cleaning",
      "Performance optimization",
      "Priority service",
    ],
    benefits: [
      "Prevent breakdowns",
      "Lower energy bills",
      "Extend system lifespan",
      "Maintain warranty coverage",
    ],
  },
  {
    slug: "indoor-air-quality",
    title: "Indoor Air Quality",
    shortDescription: "Improve your home's air quality with advanced filtration and purification systems.",
    fullDescription: "Breathe easier with our indoor air quality solutions. We offer air purifiers, UV lights, humidifiers, dehumidifiers, and advanced filtration systems to remove allergens, pollutants, and contaminants from your home's air. Our solutions help reduce allergies, asthma symptoms, and respiratory issues while creating a healthier living environment for your family.",
    icon: Wind,
    features: [
      "Air purifiers & filters",
      "UV light installation",
      "Humidifiers & dehumidifiers",
      "Duct cleaning",
      "Air quality testing",
    ],
    benefits: [
      "Healthier indoor air",
      "Reduced allergies",
      "Eliminate odors",
      "Protect your family",
    ],
  },
  {
    slug: "ductwork",
    title: "Ductwork Services",
    shortDescription: "Professional ductwork installation, repair, and cleaning for optimal airflow.",
    fullDescription: "Properly functioning ductwork is essential for efficient HVAC performance. Our ductwork services include installation, repair, sealing, and cleaning. We identify and fix leaks, blockages, and design issues that reduce efficiency and comfort. With proper ductwork, you'll enjoy better airflow, lower energy costs, and improved indoor air quality throughout your home.",
    icon: Gauge,
    features: [
      "Duct installation",
      "Leak detection & sealing",
      "Duct cleaning",
      "Design optimization",
      "Energy efficiency improvements",
    ],
    benefits: [
      "Better airflow",
      "Reduced energy waste",
      "Improved comfort",
      "Cleaner air",
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
