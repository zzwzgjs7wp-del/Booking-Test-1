import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${siteConfig.name} for HVAC services in ${siteConfig.serviceArea}. Call ${siteConfig.phone} or fill out our contact form.`,
  openGraph: {
    title: `Contact Us | ${siteConfig.name}`,
    description: `Get in touch for HVAC services. We're here to help!`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Get in touch with us today. We're here to help with all your HVAC
            needs.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Get in Touch
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="text-primary hover:underline text-lg"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-primary hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-700">
                      {siteConfig.address.street}
                      <br />
                      {siteConfig.address.city}, {siteConfig.address.state}{" "}
                      {siteConfig.address.zip}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-700">
                      {siteConfig.businessHours.weekdays}
                      <br />
                      {siteConfig.businessHours.saturday}
                      <br />
                      {siteConfig.businessHours.sunday}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Service Area
                </h3>
                <p className="text-gray-700">
                  We proudly serve {siteConfig.serviceArea} and surrounding
                  areas.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
