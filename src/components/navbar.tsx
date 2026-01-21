"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {services.map((service) => (
                  <DropdownMenuItem key={service.slug} asChild>
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/service-areas"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Service Areas
            </Link>
            <Link
              href="/financing"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Financing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/book" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Request Service
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900">
                  Services
                </div>
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="block pl-4 text-sm text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
              <Link
                href="/service-areas"
                className="text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Service Areas
              </Link>
              <Link
                href="/financing"
                className="text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Financing
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link
                  href="/book"
                  className="flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  Request Service
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
