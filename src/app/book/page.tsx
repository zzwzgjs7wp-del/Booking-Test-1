import { Metadata } from "next";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Request Service",
  description: `Request HVAC service from ${siteConfig.name}. Schedule your appointment online or call ${siteConfig.phone}.`,
  openGraph: {
    title: `Request Service | ${siteConfig.name}`,
    description: `Schedule your HVAC service appointment today.`,
  },
};

export default function BookPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Request Service
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Fill out the form below to schedule your HVAC service. We'll
            contact you shortly to confirm your appointment.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-4">
            Prefer to speak with someone? Give us a call!
          </p>
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-xl font-semibold text-primary hover:underline"
          >
            <Phone className="h-5 w-5" />
            {siteConfig.phone}
          </a>
        </div>
      </section>
    </div>
  );
}
