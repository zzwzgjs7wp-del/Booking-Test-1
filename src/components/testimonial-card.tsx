import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  service?: string;
}

export function TestimonialCard({
  name,
  location,
  rating,
  text,
  service,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-700 mb-4">{text}</p>
      <div className="border-t pt-4">
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{location}</p>
        {service && (
          <p className="text-xs text-primary mt-1">Service: {service}</p>
        )}
      </div>
    </div>
  );
}
