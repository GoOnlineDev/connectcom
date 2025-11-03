"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How do I create a shop?",
    answer: "To create a shop, go to 'Create Shop' in the navigation menu or visit the onboarding page. Fill out the required information including shop name, type (product or service), and description. Once submitted, your shop will be reviewed by our admin team.",
  },
  {
    question: "How long does shop approval take?",
    answer: "Shop approvals are typically processed within 24-48 hours. You'll receive an email notification once your shop has been reviewed.",
  },
  {
    question: "How do I add products or services to my shop?",
    answer: "Navigate to your shop's management page and select 'Add Product' or 'Add Service'. Fill in the details including name, description, pricing, and images.",
  },
  {
    question: "How do I manage my orders?",
    answer: "As a vendor, you can view and manage all orders in the 'Orders & Bookings' section of your dashboard. Customers can track their orders in the 'My Orders' section.",
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support by submitting a ticket in the 'Contact Support' section, or email us at connectcom256@gmail.com or call +256 783 618441.",
  },
  {
    question: "What subscription packages are available?",
    answer: "We offer Free, Pro, and Unlimited packages. Each package has different limits for shops, shelves, and items. Visit the Subscriptions section in your dashboard for details.",
  },
  {
    question: "How do I update my profile?",
    answer: "Go to Settings > Profile to update your personal information including name, phone number, and location.",
  },
  {
    question: "How do I change my notification preferences?",
    answer: "Visit Settings > Notifications to control email notifications, push notifications, and marketing emails.",
  },
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Help Center</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-burgundy border-burgundy hover:bg-burgundy/10"
        >
          Back
        </Button>
      </div>

      <Card className="bg-white border-burgundy/10 mb-6">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-burgundy" />
            <CardTitle className="text-lg text-burgundy">Frequently Asked Questions</CardTitle>
          </div>
          <CardDescription className="text-burgundy/70">
            Find answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-burgundy/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-4 flex items-center justify-between text-burgundy hover:bg-burgundy/5 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-burgundy/70 border-t border-burgundy/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-burgundy/10">
        <CardHeader>
          <CardTitle className="text-lg text-burgundy">Still need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-burgundy/70">
              If you couldn't find what you're looking for, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/support/contact">
                <Button className="w-full sm:w-auto bg-burgundy-600 text-white hover:bg-burgundy-700">
                  Contact Support
                </Button>
              </Link>
              <Link href="/support/report">
                <Button variant="outline" className="w-full sm:w-auto text-burgundy border-burgundy hover:bg-burgundy/10">
                  Report an Issue
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
