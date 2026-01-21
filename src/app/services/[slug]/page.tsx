import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services, getServiceBySlug } from "@/config/services";
import { CTAButton } from "@/components/cta-button";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | ${siteConfig.name}`,
    description: service.fullDescription,
    openGraph: {
      title: `${service.title} in ${siteConfig.serviceArea}`,
      description: service.fullDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {service.title}
              </h1>
            </div>
            <p className="text-xl text-gray-700">{service.fullDescription}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What We Offer
                </h2>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Benefits
                </h2>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get Started Today
                </h3>
                <p className="text-gray-600 mb-6">
                  Ready to schedule {service.title.toLowerCase()}? Contact us
                  for a free estimate.
                </p>
                <div className="space-y-4">
                  <CTAButton type="both" className="flex-col" />
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Or call us:</p>
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="text-xl font-semibold text-primary hover:underline flex items-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Other Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services
              .filter((s) => s.slug !== slug)
              .slice(0, 3)
              .map((relatedService) => {
                const RelatedIcon = relatedService.icon;
                return (
                  <Link
                    key={relatedService.slug}
                    href={`/services/${relatedService.slug}`}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
                  >
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <RelatedIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {relatedService.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {relatedService.shortDescription}
                    </p>
                    <div className="flex items-center text-primary font-medium">
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
