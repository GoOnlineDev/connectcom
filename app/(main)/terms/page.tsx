"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Scale, 
  Users, 
  Store, 
  ShoppingCart, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  ArrowLeft,
  FileText,
  Globe,
  Gavel,
  UserCheck,
  CreditCard,
  MessageSquare
} from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = "January 2024";
  const effectiveDate = "January 1, 2024";

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: UserCheck,
      content: [
        "By accessing or using ConnectCom, you agree to be bound by these Terms of Service",
        "If you disagree with any part of these terms, you may not access the service",
        "These terms apply to all visitors, users, and others who access or use the service",
        "We reserve the right to update these terms at any time with notice to users"
      ]
    },
    {
      id: "accounts",
      title: "User Accounts",
      icon: Users,
      content: [
        "You must be at least 18 years old to create an account",
        "You are responsible for maintaining the security of your account credentials",
        "You must provide accurate and complete information when creating your account",
        "One person or entity may maintain only one account",
        "You are responsible for all activities that occur under your account",
        "Notify us immediately of any unauthorized use of your account"
      ]
    },
    {
      id: "shop-creation",
      title: "Shop Creation and Management",
      icon: Store,
      content: [
        "Vendors must provide accurate business information when creating shops",
        "All shops are subject to approval by ConnectCom administrators",
        "Shop owners are responsible for the accuracy of their product/service listings",
        "Prohibited items and services cannot be listed (see prohibited content section)",
        "Shop owners must respond to customer inquiries in a timely manner",
        "ConnectCom reserves the right to suspend or remove shops that violate these terms"
      ]
    },
    {
      id: "transactions",
      title: "Transactions and Payments",
      icon: CreditCard,
      content: [
        "ConnectCom facilitates transactions between customers and shop owners",
        "Payment processing is handled by secure third-party providers",
        "Shop owners are responsible for fulfilling orders and providing services",
        "Customers are responsible for providing accurate payment information",
        "Dispute resolution should first be attempted between customer and shop owner",
        "ConnectCom may assist in dispute resolution but is not liable for transaction outcomes"
      ]
    },
    {
      id: "prohibited-content",
      title: "Prohibited Content and Conduct",
      icon: XCircle,
      content: [
        "Illegal products, services, or activities of any kind",
        "Fraudulent, misleading, or deceptive business practices",
        "Harassment, abuse, or threatening behavior toward other users",
        "Spam, unsolicited communications, or promotional content outside designated areas",
        "Violation of intellectual property rights",
        "Content that is offensive, discriminatory, or harmful",
        "Attempts to circumvent platform security or payment systems"
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: Shield,
      content: [
        "ConnectCom and its original content are protected by copyright and trademark laws",
        "Users retain ownership of content they create and upload",
        "By posting content, you grant ConnectCom a license to use it for platform operations",
        "Users must respect the intellectual property rights of others",
        "Report any copyright infringement to our designated agent",
        "Repeat infringers may have their accounts terminated"
      ]
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: AlertTriangle,
      content: [
        "ConnectCom is provided 'as is' without warranties of any kind",
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability to you is limited to the amount you paid us in the past 12 months",
        "We do not guarantee the accuracy, completeness, or reliability of user-generated content",
        "Users interact with each other at their own risk",
        "We are not responsible for the quality, safety, or legality of items or services listed"
      ]
    }
  ];

  const userRights = [
    "Access and use the ConnectCom platform in accordance with these terms",
    "Create and manage your user account and shop (if applicable)",
    "List products and services (subject to our guidelines)",
    "Communicate with other users through platform features",
    "Receive customer support for platform-related issues",
    "Request deletion of your account and associated data"
  ];

  const userResponsibilities = [
    "Comply with all applicable laws and regulations",
    "Provide accurate and truthful information",
    "Maintain the security of your account",
    "Respect the rights and privacy of other users",
    "Use the platform only for legitimate business and personal purposes",
    "Report violations of these terms to ConnectCom"
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
            <Scale className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 max-w-3xl mx-auto opacity-90">
            Understanding your rights and responsibilities when using ConnectCom
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
              Last updated: {lastUpdated}
            </Badge>
            <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
              Effective: {effectiveDate}
            </Badge>
          </div>
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
              These Terms of Service govern your use of ConnectCom, a community-based ecommerce platform 
              that connects local businesses with customers. Please read these terms carefully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border border-burgundy-200 bg-burgundy-50">
              <CheckCircle className="h-4 w-4 text-burgundy-700" />
              <AlertDescription className="text-burgundy-700">
                <strong>Important:</strong> By using ConnectCom, you agree to these terms. If you don't agree, 
                please don't use our platform. We may update these terms from time to time, and we'll notify you of any changes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Main Terms Sections */}
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

        {/* Rights and Responsibilities */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-burgundy-200">
            <CardHeader>
              <CardTitle className="text-burgundy-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Your Rights
              </CardTitle>
              <CardDescription className="text-burgundy-700">
                What you can do on ConnectCom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {userRights.map((right, index) => (
                  <li key={index} className="flex items-start gap-3 text-burgundy-700 text-sm md:text-base">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-burgundy-200">
            <CardHeader>
              <CardTitle className="text-burgundy-900 flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Your Responsibilities
              </CardTitle>
              <CardDescription className="text-burgundy-700">
                What we expect from you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {userResponsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3 text-burgundy-700 text-sm md:text-base">
                    <Gavel className="w-4 h-4 text-burgundy-700 mt-0.5 flex-shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Platform-Specific Terms */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-burgundy-200">
            <CardHeader>
              <CardTitle className="text-burgundy-900 flex items-center gap-2">
                <Store className="w-5 h-5" />
                For Shop Owners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <div className="bg-burgundy-50 rounded-lg p-4 border border-burgundy-100">
                <h4 className="font-semibold text-burgundy-900 mb-2">Shop Approval Process</h4>
                <p className="text-burgundy-700 text-sm">
                  All new shops undergo review by our admin team. We check for compliance with our guidelines, 
                  accuracy of information, and appropriateness of content.
                </p>
              </div>
              <div className="bg-burgundy-50 rounded-lg p-4 border border-burgundy-100">
                <h4 className="font-semibold text-burgundy-900 mb-2">Quality Standards</h4>
                <p className="text-burgundy-700 text-sm">
                  Maintain high-quality product images, accurate descriptions, and responsive customer service 
                  to ensure a positive experience for all users.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-burgundy-200">
            <CardHeader>
              <CardTitle className="text-burgundy-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                For Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <div className="bg-burgundy-50 rounded-lg p-4 border border-burgundy-100">
                <h4 className="font-semibold text-burgundy-900 mb-2">Safe Shopping</h4>
                <p className="text-burgundy-700 text-sm">
                  Review shop information, read product descriptions carefully, and communicate with shop owners 
                  before making purchases to ensure satisfaction.
                </p>
              </div>
              <div className="bg-burgundy-50 rounded-lg p-4 border border-burgundy-100">
                <h4 className="font-semibold text-burgundy-900 mb-2">Dispute Resolution</h4>
                <p className="text-burgundy-700 text-sm">
                  Contact shop owners directly for issues with orders. If unresolved, our support team 
                  can help facilitate communication and resolution.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Termination and Enforcement */}
        <Card className="border border-burgundy-200 mt-8 md:mt-12">
          <CardHeader>
            <CardTitle className="text-burgundy-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Termination and Enforcement
            </CardTitle>
            <CardDescription className="text-burgundy-700">
              How we handle violations and account termination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-burgundy-900 mb-3">Violations</h4>
                <ul className="space-y-2 text-burgundy-700 text-sm md:text-base">
                  <li>• Warning for minor violations</li>
                  <li>• Temporary suspension for repeated violations</li>
                  <li>• Permanent ban for serious violations</li>
                  <li>• Immediate termination for illegal activities</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-burgundy-900 mb-3">Your Rights</h4>
                <ul className="space-y-2 text-burgundy-700 text-sm md:text-base">
                  <li>• Appeal enforcement actions</li>
                  <li>• Request explanation of violations</li>
                  <li>• Download your data before termination</li>
                  <li>• Seek clarification on policies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact and Legal */}
        <Card className="border border-burgundy-200 mt-8 md:mt-12">
          <CardHeader>
            <CardTitle className="text-burgundy-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Questions About These Terms?
            </CardTitle>
            <CardDescription className="text-burgundy-700">
              We're here to help you understand your rights and responsibilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-burgundy-700" />
                  <span className="text-burgundy-700 text-sm md:text-base">legal@connectcom.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-burgundy-700" />
                  <span className="text-burgundy-700 text-sm md:text-base">www.connectcom.com/legal</span>
                </div>
                <div className="text-xs md:text-sm text-burgundy-600">
                  <p>ConnectCom Legal Department</p>
                  <p>Response time: 2-3 business days</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button asChild className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white">
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Legal Team
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                >
                  <Link href="/policy">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Notice */}
        <div className="mt-8 md:mt-12 text-center">
          <Card className="border border-burgundy-200 bg-gradient-to-r from-burgundy-50 to-burgundy-100 max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-burgundy-900 mb-3">Changes to Terms</h3>
              <p className="text-burgundy-700 text-sm md:text-base mb-4">
                We may revise these terms from time to time. The most current version will always be posted on this page. 
                If we make significant changes, we'll notify you through the platform or via email.
              </p>
              <p className="text-burgundy-600 text-xs md:text-sm">
                By continuing to use ConnectCom after changes become effective, you agree to the revised terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
