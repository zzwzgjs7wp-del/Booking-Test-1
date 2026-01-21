import { Metadata } from "next";
import Link from "next/link";
import { Phone, Shield, Star, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";
import { CTAButton } from "@/components/cta-button";
import { TestimonialCard } from "@/components/testimonial-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.seo.defaultDescription,
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
};

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Houston, TX",
    rating: 5,
    text: "ArcticPro HVAC saved us during a heatwave! Their technician arrived same-day and fixed our AC quickly. Professional, courteous, and reasonably priced. Highly recommend!",
    service: "AC Repair",
  },
  {
    name: "Michael Chen",
    location: "Houston, TX",
    rating: 5,
    text: "We needed a new AC unit installed. The team was knowledgeable, helped us choose the right system, and the installation was flawless. Our energy bills have dropped significantly!",
    service: "AC Installation",
  },
  {
    name: "Patricia Martinez",
    location: "Houston, TX",
    rating: 5,
    text: "Regular maintenance plan has kept our HVAC system running perfectly for years. The technicians are always on time and thorough. Great service!",
    service: "Maintenance",
  },
];

const faqs = [
  {
    question: "Do you offer same-day service?",
    answer:
      "Yes! We offer same-day service for emergency repairs. Call us and we'll do our best to get a technician to your home the same day.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Absolutely. ArcticPro HVAC is fully licensed and insured. We carry comprehensive liability insurance and all our technicians are certified.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We proudly serve Houston, TX and surrounding areas. Contact us to confirm if we service your specific location.",
  },
  {
    question: "Do you offer financing options?",
    answer:
      "Yes! We offer flexible financing options to make HVAC services more affordable. Visit our financing page or call us to learn more about available plans.",
  },
  {
    question: "How often should I have my HVAC system serviced?",
    answer:
      "We recommend annual maintenance for your HVAC system - once in the spring for your AC and once in the fall for your heating system. This helps prevent breakdowns and keeps your system running efficiently.",
  },
  {
    question: "What brands do you service?",
    answer:
      "We service all major HVAC brands including Carrier, Trane, Lennox, Rheem, Goodman, and more. Our technicians are trained on all makes and models.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    image: "https://arcticprohvac.com/og-image.jpg",
    "@id": "https://arcticprohvac.com",
    url: "https://arcticprohvac.com",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "29.7604",
      longitude: "-95.3698",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "17:00",
      },
    ],
    areaServed: {
      "@type": "City",
      name: siteConfig.serviceArea,
    },
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "127",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Expert HVAC Services in{" "}
              <span className="text-primary">{siteConfig.serviceArea}</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Fast, reliable AC repair, installation, and maintenance. Licensed,
              insured, and 5-star rated. Same-day service available.
            </p>
            <CTAButton type="both" />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                Licensed & Insured
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                5-Star Rated
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                Same-Day Service
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive HVAC solutions for your home and business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.shortDescription}</p>
                  <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Spring AC Tune-Up Special
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get your AC ready for summer! Schedule a maintenance visit and save
            20% on any repairs needed.
          </p>
          <CTAButton
            type="book"
            variant="outline"
            className="bg-white text-primary hover:bg-gray-100"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Get answers to common questions about our services
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Service Areas Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Serving {siteConfig.serviceArea}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We proudly serve Houston and surrounding areas with fast, reliable
              HVAC services. Check if we service your area.
            </p>
            <Button asChild size="lg">
              <Link href="/service-areas">View Service Areas</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
