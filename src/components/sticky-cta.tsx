"use client";

import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2">
          <Button
            asChild
            className="flex-1 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Link href="/book">
              <Calendar className="h-4 w-4 mr-2" />
              Request Service
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
