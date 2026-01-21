import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  type?: "call" | "book" | "both";
}

export function CTAButton({
  variant = "default",
  size = "lg",
  className,
  type = "both",
}: CTAButtonProps) {
  if (type === "call") {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        className={cn("bg-primary hover:bg-primary/90", className)}
      >
        <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
          <Phone className="h-4 w-4 mr-2" />
          Call Now
        </a>
      </Button>
    );
  }

  if (type === "book") {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        className={className}
      >
        <Link href="/book">
          <Calendar className="h-4 w-4 mr-2" />
          Request Service
        </Link>
      </Button>
    );
  }

  return (
    <div className={cn("flex gap-4", className)}>
      <Button
        asChild
        variant={variant}
        size={size}
        className="bg-primary hover:bg-primary/90"
      >
        <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
          <Phone className="h-4 w-4 mr-2" />
          Call Now
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size={size}
      >
        <Link href="/book">
          <Calendar className="h-4 w-4 mr-2" />
          Request Service
        </Link>
      </Button>
    </div>
  );
}
