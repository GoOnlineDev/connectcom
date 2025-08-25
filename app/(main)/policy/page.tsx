"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Store, 
  CreditCard, 
  Mail, 
  Phone,
  ArrowLeft,
  FileText,
  Globe,
  Database,
  UserCheck
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 2024";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        "Personal information you provide when creating an account (name, email, phone number)",
        "Shop information including business details, contact information, and operating hours", 
        "Product and service listings you create as a vendor",
        "Transaction history and payment information",
        "Communication preferences and marketing consents",
        "Device information and usage analytics to improve our platform"
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information", 
      icon: UserCheck,
      content: [
        "To create and manage your ConnectCom account",
        "To enable shop creation and management for vendors",
        "To facilitate transactions between customers and shops",
        "To provide customer support and respond to inquiries",
        "To send important updates about your account or shop",
        "To improve our platform and develop new features",
        "To ensure platform security and prevent fraud"
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: Users,
      content: [
        "Shop information is publicly displayed to help customers discover businesses",
        "Contact details are shared only when customers interact with your shop",
        "We never sell your personal information to third parties",
        "Payment processing is handled securely by our trusted partners",
        "We may share aggregated, non-personal data for analytics purposes",
        "Legal compliance may require disclosure in certain circumstances"
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        "We use industry-standard encryption to protect your data",
        "Secure authentication through Clerk ensures account safety",
        "Payment information is processed securely and never stored on our servers",
        "Regular security audits and updates to maintain protection",
        "Access controls limit who can view your personal information",
        "We monitor for suspicious activity and unauthorized access"
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: Shield,
      content: [
        "Access and review your personal information at any time",
        "Update or correct your account and shop information",
        "Delete your account and associated data",
        "Opt out of marketing communications",
        "Request a copy of your data in a portable format",
        "Lodge complaints with relevant data protection authorities"
      ]
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: Eye,
      content: [
        "We use essential cookies for platform functionality",
        "Analytics cookies help us understand how you use ConnectCom",
        "You can control cookie preferences in your browser settings",
        "Third-party services may use their own cookies",
        "We respect Do Not Track signals where technically feasible"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-burgundy-100">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-burgundy-700 hover:text-burgundy-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-950 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 max-w-3xl mx-auto opacity-90">
            Your privacy is important to us. Learn how ConnectCom protects and uses your information.
          </p>
          <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
            Last updated: {lastUpdated}
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Introduction */}
        <Card className="border border-burgundy-200 mb-8">
          <CardHeader>
            <CardTitle className="text-burgundy-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Welcome to ConnectCom
            </CardTitle>
            <CardDescription className="text-base text-burgundy-700">
              ConnectCom is a community-based ecommerce platform that connects local businesses with customers. 
              This privacy policy explains how we collect, use, and protect your information when you use our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-burgundy-50 rounded-lg p-4 md:p-6 border border-burgundy-100">
              <h3 className="font-semibold text-burgundy-900 mb-3">Our Commitment to You</h3>
              <p className="text-burgundy-700 text-sm md:text-base">
                We believe in transparency and giving you control over your data. Whether you're a customer 
                discovering local shops or a vendor building your online presence, we're committed to protecting 
                your privacy while enabling meaningful connections in your community.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-6 md:space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} className="border border-burgundy-200">
                <CardHeader>
                  <CardTitle className="text-burgundy-900 flex items-center gap-3 text-lg md:text-xl">
                    <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-burgundy-700" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-burgundy-700 text-sm md:text-base">
                        <div className="w-2 h-2 bg-burgundy-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform-Specific Information */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-burgundy-200">
            <CardHeader>
              <CardTitle className="text-burgundy-900 flex items-center gap-2">
                <Store className="w-5 h-5" />
                For Shop Owners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-burgundy-700">
                When you create a shop on ConnectCom, certain information becomes publicly visible to help 
                customers find and connect with your business:
              </p>
              <ul className="space-y-2 text-burgundy-600">
                <li>• Shop name and description</li>
                <li>• Contact information (as provided by you)</li>
                <li>• Operating hours and location</li>
                <li>• Product and service listings</li>
                <li>• Shop categories and tags</li>
              </ul>
              <p className="text-burgundy-700 text-xs md:text-sm">
                You control what information to share and can update it anytime through your shop dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-burgundy-200">
            <CardHeader>
              <CardTitle className="text-burgundy-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-burgundy-700">
                ConnectCom partners with trusted payment processors to ensure your financial information 
                is handled securely:
              </p>
              <ul className="space-y-2 text-burgundy-600">
                <li>• PCI DSS compliant payment processing</li>
                <li>• Encrypted transmission of payment data</li>
                <li>• No storage of credit card information</li>
                <li>• Fraud detection and prevention</li>
                <li>• Secure checkout process</li>
              </ul>
              <p className="text-burgundy-700 text-xs md:text-sm">
                We never see or store your complete payment details.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="border border-burgundy-200 mt-8 md:mt-12">
          <CardHeader>
            <CardTitle className="text-burgundy-900 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us About Privacy
            </CardTitle>
            <CardDescription className="text-burgundy-700">
              Have questions about this privacy policy or how we handle your data? We're here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-burgundy-700" />
                  <span className="text-burgundy-700 text-sm md:text-base">privacy@connectcom.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-burgundy-700" />
                  <span className="text-burgundy-700 text-sm md:text-base">www.connectcom.com/support</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button asChild className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white">
                  <Link href="/contact">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                >
                  <Link href="/terms">
                    <FileText className="w-4 h-4 mr-2" />
                    Terms of Service
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates Notice */}
        <div className="mt-8 md:mt-12 text-center">
          <Card className="border border-burgundy-200 bg-gradient-to-r from-burgundy-50 to-burgundy-100 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-burgundy-900 mb-3">Policy Updates</h3>
              <p className="text-burgundy-700 text-sm md:text-base mb-4">
                We may update this privacy policy from time to time. When we do, we'll notify you through 
                the platform and update the "last updated" date above.
              </p>
              <p className="text-burgundy-600 text-xs md:text-sm">
                Continued use of ConnectCom after policy changes constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
