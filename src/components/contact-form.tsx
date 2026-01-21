"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
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
          type: "contact",
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! We'll get back to you soon.",
        });
        reset();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          {...register("subject")}
          placeholder="What can we help you with?"
          className="mt-1"
        />
        {errors.subject && (
          <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tell us more about your needs..."
          rows={5}
          className="mt-1"
        />
        {errors.message && (
          <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
        )}
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
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
