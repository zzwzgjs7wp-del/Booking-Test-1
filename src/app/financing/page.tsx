import { Metadata } from "next";
import { CheckCircle2, CreditCard, Shield, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/cta-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Financing Options",
  description: `Flexible financing options for HVAC services in ${siteConfig.serviceArea}. Make your home comfort affordable with our payment plans.`,
  openGraph: {
    title: `Financing Options | ${siteConfig.name}`,
    description: `Affordable payment plans for HVAC services.`,
  },
};

const financingOptions = [
  {
    title: "0% APR Financing",
    description: "No interest financing for qualified customers on purchases over $2,500",
    features: ["12-60 month terms", "Quick approval", "No prepayment penalty"],
  },
  {
    title: "Low Monthly Payments",
    description: "Spread the cost of your HVAC system over affordable monthly payments",
    features: ["Flexible terms", "Competitive rates", "Easy application"],
  },
  {
    title: "Same-As-Cash Options",
    description: "Pay within the promotional period with no interest charges",
    features: ["6-18 month terms", "No interest if paid in full", "Flexible payments"],
  },
];

const benefits = [
  "No money down options available",
  "Quick and easy application process",
  "Competitive interest rates",
  "Flexible payment terms",
  "No prepayment penalties",
  "Approval in minutes",
];

export default function FinancingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Flexible Financing Options
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Make your HVAC investment affordable with our flexible financing
            plans. Get the comfort you deserve without breaking the bank.
          </p>
        </div>
      </section>

      {/* Financing Options */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {financingOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Our Financing?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Easy Application
                </h3>
                <p className="text-gray-600">
                  Simple online application process that takes just minutes
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Secure & Safe
                </h3>
                <p className="text-gray-600">
                  Your information is protected with bank-level security
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Quick Approval
                </h3>
                <p className="text-gray-600">
                  Get approved in minutes and start your project today
                </p>
              </div>
            </div>
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
            Contact us today to learn more about our financing options and get
            a free estimate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                Call {siteConfig.phone}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
