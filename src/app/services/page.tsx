import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description: `Comprehensive HVAC services in ${siteConfig.serviceArea}. AC repair, installation, heating, maintenance, indoor air quality, and ductwork services.`,
  openGraph: {
    title: `HVAC Services | ${siteConfig.name}`,
    description: `Professional HVAC services in ${siteConfig.serviceArea}.`,
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our HVAC Services
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Comprehensive heating, cooling, and air quality solutions for your
            home and business in {siteConfig.serviceArea}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.slug}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary hover:shadow-xl transition-all"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {service.shortDescription}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/services/${service.slug}`}>
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us today for a free estimate or to schedule service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/book">Request Service</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
