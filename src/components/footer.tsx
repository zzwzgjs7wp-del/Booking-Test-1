import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              {siteConfig.name}
            </h3>
            <p className="text-sm mb-4">
              Professional HVAC services in {siteConfig.serviceArea}. Licensed,
              insured, and committed to your comfort.
            </p>
            <div className="flex space-x-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/service-areas"
                  className="hover:text-primary transition-colors"
                >
                  Service Areas
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/ac-repair"
                  className="hover:text-primary transition-colors"
                >
                  AC Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ac-installation"
                  className="hover:text-primary transition-colors"
                >
                  AC Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/heating"
                  className="hover:text-primary transition-colors"
                >
                  Heating Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services/maintenance"
                  className="hover:text-primary transition-colors"
                >
                  Maintenance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="hover:text-primary transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.state}{" "}
                  {siteConfig.address.zip}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div>{siteConfig.businessHours.weekdays}</div>
                  <div>{siteConfig.businessHours.saturday}</div>
                  <div>{siteConfig.businessHours.sunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved. | Licensed
            & Insured
          </p>
        </div>
      </div>
    </footer>
  );
}
