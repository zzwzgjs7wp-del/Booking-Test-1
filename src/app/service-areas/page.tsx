import { Metadata } from "next";
import { MapPin, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/cta-button";

export const metadata: Metadata = {
  title: "Service Areas",
  description: `HVAC services in ${siteConfig.serviceArea} and surrounding areas. Check if we service your location.`,
  openGraph: {
    title: `Service Areas | ${siteConfig.name}`,
    description: `We serve ${siteConfig.serviceArea} and surrounding communities.`,
  },
};

const serviceAreas = [
  "Houston",
  "Katy",
  "Sugar Land",
  "The Woodlands",
  "Pearland",
  "League City",
  "Pasadena",
  "Missouri City",
  "Baytown",
  "Friendswood",
  "Spring",
  "Cypress",
  "Tomball",
  "Humble",
  "Kingwood",
];

export default function ServiceAreasPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Service Areas
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Proudly serving {siteConfig.serviceArea} and surrounding
            communities with fast, reliable HVAC services
          </p>
        </div>
      </section>

      {/* Service Areas List */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {serviceAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-gray-900">{area}</span>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Don't See Your Area?
              </h2>
              <p className="text-gray-700 mb-6">
                We're always expanding our service area! Contact us to see if we
                can service your location. We may be able to accommodate your
                needs even if your area isn't listed.
              </p>
              <CTAButton type="both" />
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Service Area Map
            </h2>
            <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Map embed placeholder - Add Google Maps embed here
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Example: &lt;iframe src="https://www.google.com/maps/embed?..."&gt;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Us for Your Area?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Local expertise in Houston-area HVAC systems",
                "Fast response times for emergency repairs",
                "Knowledge of local building codes and regulations",
                "Competitive pricing for your area",
                "Same-day service available",
                "Fully licensed and insured",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
