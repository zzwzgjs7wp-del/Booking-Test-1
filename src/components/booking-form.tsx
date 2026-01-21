"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services } from "@/config/services";
import { CheckCircle2 } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  service: z.string().min(1, "Please select a service"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
  });

  const service = watch("service");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          type: "booking",
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! We'll contact you shortly to confirm your appointment.",
        });
        reset();
        setCurrentStep(1);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again or call us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div
                className={`w-20 h-1 ${
                  currentStep > step ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Contact Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Your name"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className="mt-1"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="(713) 555-0199"
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={nextStep} size="lg">
              Next: Service Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Service Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Service Details</h3>
          <div>
            <Label htmlFor="service">Service Needed *</Label>
            <Select
              value={service || ""}
              onValueChange={(value) => {
                setValue("service", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="mt-1" id="service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((svc) => (
                  <SelectItem key={svc.slug} value={svc.slug}>
                    {svc.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-sm text-red-600 mt-1">{errors.service.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address">Service Address *</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="123 Main St"
              className="mt-1"
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="Houston"
                className="mt-1"
              />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                {...register("zip")}
                placeholder="77001"
                className="mt-1"
              />
              {errors.zip && (
                <p className="text-sm text-red-600 mt-1">{errors.zip.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="button" onClick={nextStep} size="lg">
              Next: Schedule
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Schedule */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Preferred Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="preferredDate">Preferred Date *</Label>
              <Input
                id="preferredDate"
                type="date"
                {...register("preferredDate")}
                className="mt-1"
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.preferredDate && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="preferredTime">Preferred Time *</Label>
              <Select
                onValueChange={(value) => {
                  setValue("preferredTime", value, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1" id="preferredTime">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                  <SelectItem value="evening">Evening (5 PM - 7 PM)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredTime && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.preferredTime.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="message">Additional Notes (Optional)</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Any special instructions or details..."
              rows={4}
              className="mt-1"
            />
          </div>
          {submitStatus.type && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
